'use strict';

/**
 * prefab-ref-checker 核心扫描逻辑（纯 Node 实现，不依赖编辑器 API，方便离线自测）
 *
 * 检查项：
 *  1. __id__ 内部引用越界（文件损坏）
 *  2. __uuid__ 资源引用不存在（丢失资源）
 *  3. 脚本组件 __type__ 找不到对应脚本（Missing Script）
 *  4. cc.ParticleSystem 未绑定纹理（_custom=true 无 file/spriteFrame —— 即现金掉落特效不渲染的问题）
 *  5. cc.Sprite 无 SpriteFrame / sp.Skeleton 无 SkeletonData / cc.Label 无字体 / cc.AudioSource 无 clip
 *  6. cc.ClickEvent 的 target 组件与 handler 校验
 *  7. 脚本 @property 声明的引用类型属性在 prefab 中未绑定（提示级）
 */

const fs = require('fs');
const path = require('path');

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/** 将带横线的 uuid 压缩为 Cocos 序列化使用的 23 位压缩 uuid */
function compressUuid (uuid) {
    const hex = uuid.replace(/-/g, '');
    if (hex.length !== 32 || /[^0-9a-fA-F]/.test(hex)) return null;
    let out = hex.slice(0, 5);
    for (let i = 5; i + 3 <= hex.length; i += 3) {
        const n = parseInt(hex.substr(i, 3), 16);
        out += BASE64_CHARS[(n >> 6) & 63] + BASE64_CHARS[n & 63];
    }
    return out;
}

/** 判断 __type__ 是否是脚本压缩 uuid（23 位 base64、无点号、前 5 位为 hex） */
function looksLikeScriptUuid (type) {
    return typeof type === 'string'
        && type.length === 23
        && type.indexOf('.') === -1
        && /^[0-9a-fA-F]{5}/.test(type)
        && /^[A-Za-z0-9+/]+$/.test(type);
}

function walkDir (dir, filter, out) {
    out = out || [];
    let list;
    try { list = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return out; }
    for (const ent of list) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) {
            walkDir(full, filter, out);
        } else if (filter(ent.name)) {
            out.push(full);
        }
    }
    return out;
}

function readJson (file) {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
        return null;
    }
}

function readText (file) {
    try { return fs.readFileSync(file, 'utf8'); } catch (e) { return ''; }
}

// ---------------------------------------------------------------------------
// 资源 / 脚本索引
// ---------------------------------------------------------------------------

/**
 * 扫描 assets 目录下全部 .meta，建立：
 *  - assetUuids: 全量 uuid 集合
 *  - scriptMap:  压缩 uuid -> { path, name }
 *  - classMap:   类名 -> 脚本相对路径（用于识别 @property 的自定义类型）
 */
function buildAssetIndex (assetsDir) {
    const metaFiles = walkDir(assetsDir, n => n.endsWith('.meta'));
    const assetUuids = new Set();
    const scriptMap = new Map();
    // 递归收集 meta 中所有层级的 uuid（纹理的 spriteFrame 等子资源 uuid 在 subMetas 里）
    const collectUuids = (obj) => {
        if (!obj || typeof obj !== 'object') return;
        if (typeof obj.uuid === 'string') assetUuids.add(obj.uuid);
        if (obj.subMetas && typeof obj.subMetas === 'object') {
            for (const k of Object.keys(obj.subMetas)) collectUuids(obj.subMetas[k]);
        }
    };
    for (const mf of metaFiles) {
        const meta = readJson(mf);
        if (!meta || !meta.uuid) continue;
        collectUuids(meta);
        const assetPath = mf.slice(0, -5); // 去掉 .meta
        const ext = path.extname(assetPath).toLowerCase();
        if (ext === '.ts' || ext === '.js') {
            const compressed = compressUuid(meta.uuid);
            if (compressed) {
                scriptMap.set(compressed, {
                    path: assetPath,
                    name: path.basename(assetPath, ext),
                });
            }
        }
    }
    return { assetUuids, scriptMap };
}

// ---------------------------------------------------------------------------
// TS 脚本 @property 解析
// ---------------------------------------------------------------------------

const VALUE_TYPES = new Set([
    'cc.Integer', 'CCInteger', 'cc.Float', 'CCFloat',
    'cc.Boolean', 'CCBoolean', 'cc.String', 'CCString',
    'number', 'string', 'boolean', 'any', 'Object', 'object',
    'cc.Color', 'cc.Vec2', 'cc.Vec3', 'cc.Vec4', 'cc.Size', 'cc.Rect',
    'cc.ValueType', 'cc.Enum',
]);

/**
 * 解析脚本源码中 @property 声明的“引用类型”属性
 * 返回 [{ name, type }] —— 只保留需要在编辑器中绑定的引用类型（Node/资源/自定义组件）
 */
function parseRefProperties (src, classMap) {
    const props = [];
    // 支持 @property、@property(cc.Node)、@property({ type: cc.Prefab, ... })（可多行）
    const re = /@property\s*(?:\(([\s\S]*?)\))?\s*(?:public\s+|private\s+|protected\s+|readonly\s+)*([A-Za-z_$][\w$]*)\s*(?::\s*([^=;\n]+))?/g;
    let m;
    while ((m = re.exec(src)) !== null) {
        const args = (m[1] || '').trim();
        const name = m[2];
        let type = m[3] ? m[3].trim() : '';
        if (name.charAt(0) === '_') continue;
        if (!type && args) {
            // 从装饰器参数推断类型：@property(cc.Node) 或 @property({ type: cc.Node })
            const tm = /type\s*:\s*([A-Za-z_$][\w$.]*)/.exec(args) || /^([A-Za-z_$][\w$.]*)$/.exec(args);
            if (tm) type = tm[1];
        }
        if (!type) continue;
        // 数组类型取元素类型判断
        const elem = type.replace(/\[\]$/, '').replace(/^Array\s*<\s*([^>]+)\s*>$/, '$1').trim();
        if (VALUE_TYPES.has(elem)) continue;
        const isRef =
            /^(cc\.|sp\.|dragonBones\.)/.test(elem) ||
            classMap.has(elem);
        if (isRef) {
            props.push({ name, type: elem });
        }
    }
    return props;
}

/** 提取脚本中定义的方法名集合（用于 ClickEvent handler 校验） */
function parseMethodNames (src) {
    const names = new Set();
    const re = /(?:^|\n)\s*(?:public\s+|private\s+|protected\s+|static\s+|async\s+)*([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*(?::[^\{]+)?\{/g;
    let m;
    while ((m = re.exec(src)) !== null) {
        names.add(m[1]);
    }
    // 箭头函数属性写法：onClick = () => {
    const re2 = /(?:^|\n)\s*(?:public\s+|private\s+|protected\s+)*([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\(/g;
    while ((m = re2.exec(src)) !== null) {
        names.add(m[1]);
    }
    return names;
}

function buildScriptInfo (scriptMap) {
    // 类名 -> 脚本路径
    const classMap = new Map();
    const srcCache = new Map();
    const getSrc = (p) => {
        if (!srcCache.has(p)) srcCache.set(p, readText(p));
        return srcCache.get(p);
    };
    for (const info of scriptMap.values()) {
        const src = getSrc(info.path);
        const cm = /(?:export\s+(?:default\s+)?)?class\s+([A-Za-z_$][\w$]*)\s+extends/.exec(src);
        if (cm) classMap.set(cm[1], info.path);
        // 文件名也作为类名候选（导出方式可能不同）
        if (!classMap.has(info.name)) classMap.set(info.name, info.path);
    }
    // 每个脚本的引用属性 & 方法
    const propMap = new Map();   // path -> [{name,type}]
    const methodMap = new Map(); // path -> Set<string>
    for (const info of scriptMap.values()) {
        const src = getSrc(info.path);
        propMap.set(info.path, parseRefProperties(src, classMap));
        methodMap.set(info.path, parseMethodNames(src));
    }
    return { classMap, propMap, methodMap };
}

// ---------------------------------------------------------------------------
// prefab / fire 扫描
// ---------------------------------------------------------------------------

function nodePathOf (entries, nodeIdx) {
    const parts = [];
    let cur = entries[nodeIdx];
    let guard = 0;
    while (cur && guard++ < 200) {
        if (typeof cur._name === 'string') parts.unshift(cur._name || '(unnamed)');
        const parent = cur._parent;
        if (!parent || parent.__id__ === undefined || parent.__id__ === null) break;
        cur = entries[parent.__id__];
    }
    return parts.length ? parts.join('/') : '(root)';
}

function isNullRef (v) {
    return v === null || v === undefined || v === '';
}

/**
 * 扫描单个 prefab/fire 文件
 * @param file      绝对路径
 * @param relFile   相对 assets 的展示路径
 * @param index     buildAssetIndex 结果
 * @param scriptInfo buildScriptInfo 结果
 * @param pending   { uuids: Set, add(uuid, loc) } 收集疑似缺失的 uuid（稍后异步兜底）
 * @param options   { checkProps: boolean }
 */
function scanFile (file, relFile, index, scriptInfo, pending, options) {
    const results = [];
    const report = (level, node, comp, message) => {
        results.push({ file: relFile, node: node || '', component: comp || '', level, message });
    };

    const data = readJson(file);
    if (!Array.isArray(data)) {
        report('error', '', '', '文件不是合法的 prefab/fire（JSON 解析失败或不是数组）');
        return results;
    }
    const entries = data;
    const len = entries.length;

    // ---- 1. __id__ 越界 / __uuid__ 资源缺失（递归遍历所有值） ----
    const pendingUuids = new Set(); // 本文件内去重
    const walkValue = (val, ctxIdx) => {
        if (Array.isArray(val)) {
            for (const v of val) walkValue(v, ctxIdx);
        } else if (val && typeof val === 'object') {
            const keys = Object.keys(val);
            if (keys.length === 1 && val.__id__ !== undefined) {
                const id = val.__id__;
                if (typeof id !== 'number' || id < 0 || id >= len) {
                    const ctx = entries[ctxIdx] || {};
                    report('error', nodePathSafe(entries, ctx.node), typeName(ctx, index),
                        `内部引用 __id__=${id} 越界（数组长度 ${len}），文件可能已损坏`);
                }
            } else if (val.__uuid__ !== undefined) {
                const uuid = val.__uuid__;
                if (!index.assetUuids.has(uuid) && !pendingUuids.has(uuid)) {
                    pendingUuids.add(uuid);
                    const ctx = entries[ctxIdx] || {};
                    pending.add(uuid, {
                        file: relFile,
                        node: nodePathSafe(entries, ctx.node),
                        component: typeName(ctx, index),
                    });
                }
            }
            for (const k of keys) {
                if (k === '__id__' || k === '__uuid__') continue;
                walkValue(val[k], ctxIdx);
            }
        }
    };
    const typeName = (entry, idx) => {
        if (!entry || !entry.__type__) return '';
        const t = entry.__type__;
        if (looksLikeScriptUuid(t)) {
            const s = idx.scriptMap.get(t);
            return s ? s.name : t;
        }
        return t;
    };
    const nodePathSafe = (entriesRef, nodeRef) => {
        if (!nodeRef || nodeRef.__id__ === undefined) return '';
        const nid = nodeRef.__id__;
        if (nid < 0 || nid >= entriesRef.length) return '';
        return nodePathOf(entriesRef, nid);
    };
    for (let i = 0; i < len; i++) walkValue(entries[i], i);

    // ---- 2. 逐 entry 检查 ----
    for (let i = 0; i < len; i++) {
        const entry = entries[i];
        if (!entry || typeof entry !== 'object') continue;
        const type = entry.__type__;
        if (!type) continue;

        // 2a. Missing Script
        if (looksLikeScriptUuid(type) && !index.scriptMap.has(type)) {
            report('error', nodePathSafe(entries, entry.node), type,
                `Missing Script：找不到 uuid 为 ${type} 的脚本（脚本被删除或 meta uuid 变更）`);
            continue;
        }

        // 2b. 内置组件语义检查
        const nPath = nodePathSafe(entries, entry.node);
        switch (type) {
            case 'cc.ParticleSystem': {
                if (entry._custom === true && isNullRef(entry._file) && isNullRef(entry._spriteFrame)) {
                    report('warning', nPath, 'cc.ParticleSystem',
                        '粒子组件为 Custom 模式但未绑定贴图（file / spriteFrame 均为空），运行时 resetSystem 不会渲染任何粒子');
                } else if (entry._custom !== true && isNullRef(entry._file)) {
                    report('warning', nPath, 'cc.ParticleSystem', '粒子组件未绑定 plist 文件（file 为空）');
                }
                break;
            }
            case 'cc.Sprite':
                if (isNullRef(entry._spriteFrame)) {
                    report('info', nPath, 'cc.Sprite', 'Sprite 未设置 SpriteFrame（如非占位符请检查）');
                }
                break;
            case 'sp.Skeleton':
                if (isNullRef(entry._N$skeletonData)) {
                    report('warning', nPath, 'sp.Skeleton', 'Skeleton 未绑定 SkeletonData');
                }
                break;
            case 'cc.Label': {
                // 2.x 序列化字体字段为 _N$file（部分版本为 _N$font），两者都检查
                const fontRef = ('_N$file' in entry) ? entry._N$file : entry._N$font;
                if (entry._isSystemFontUsed === false && isNullRef(fontRef)) {
                    report('info', nPath, 'cc.Label', 'Label 未使用系统字体且未绑定字体文件');
                }
                break;
            }
            case 'cc.AudioSource':
                if (isNullRef(entry._clip)) {
                    report('info', nPath, 'cc.AudioSource', 'AudioSource 未绑定音频 clip');
                }
                break;
            case 'cc.Button':
                if (entry._N$interactable !== false && Array.isArray(entry.clickEvents) && entry.clickEvents.length === 0) {
                    // 可交互但没有任何点击事件，多数是漏绑
                    report('info', nPath, 'cc.Button', 'Button 可交互但未绑定任何 ClickEvent');
                }
                break;
        }

        // 2c. ClickEvent 校验（Button 及任何组件上的事件列表都可能产生 cc.ClickEvent entry）
        if (type === 'cc.ClickEvent') {
            const targetId = entry.target && entry.target.__id__;
            const handler = entry.handler;
            const compId = entry._componentId;
            if (targetId === undefined || targetId === null || targetId < 0 || targetId >= len) continue;
            const targetNode = entries[targetId];
            const tPath = nodePathOf(entries, targetId);
            if (!targetNode || !Array.isArray(targetNode._components)) continue;
            if (compId) {
                const compEntry = targetNode._components
                    .map(c => entries[c.__id__])
                    .find(c => c && c.__type__ === compId);
                if (!compEntry) {
                    report('warning', tPath, 'cc.ClickEvent',
                        `ClickEvent(handler=${handler}) 引用的组件 ${compId} 不在目标节点上`);
                } else if (handler && looksLikeScriptUuid(compId)) {
                    const sInfo = index.scriptMap.get(compId);
                    if (sInfo) {
                        const methods = scriptInfo.methodMap.get(sInfo.path);
                        if (methods && !methods.has(handler)) {
                            report('info', tPath, 'cc.ClickEvent',
                                `ClickEvent 的 handler "${handler}" 在脚本 ${sInfo.name} 中未找到（可能定义在父类或已改名）`);
                        }
                    }
                }
            }
        }

        // 2d. 脚本组件 @property 引用属性未绑定（提示级）
        if (options.checkProps && looksLikeScriptUuid(type) && index.scriptMap.has(type)) {
            const sInfo = index.scriptMap.get(type);
            const props = scriptInfo.propMap.get(sInfo.path) || [];
            for (const p of props) {
                if (!(p.name in entry) || entry[p.name] === null) {
                    report('info', nPath, sInfo.name,
                        `@property ${p.name}: ${p.type} 未在编辑器中绑定（若运行时代码赋值可忽略）`);
                }
            }
        }
    }

    return results;
}

// ---------------------------------------------------------------------------
// 入口
// ---------------------------------------------------------------------------

/**
 * @param assetsDir     项目 assets 绝对路径
 * @param resolveUuids  async (uuids: string[]) => Set<string>，返回“实际存在”的 uuid 集合
 *                      （编辑器侧用 assetdb 对内置资源兜底；离线测试可返回空集合）
 * @param options       { checkProps: boolean }
 * @param injectedIndex 可选，外部注入的 { assetUuids, scriptMap }（编辑器侧由
 *                      Editor.assetdb.queryAssets 构建；不传则用文件系统扫描 .meta）
 * @returns Promise<{results, stats}>
 */
async function scanProject (assetsDir, resolveUuids, options, injectedIndex) {
    options = options || {};
    if (options.checkProps === undefined) options.checkProps = true;

    const index = injectedIndex || buildAssetIndex(assetsDir);
    const scriptInfo = buildScriptInfo(index.scriptMap);

    // 疑似缺失 uuid 收集器（uuid -> 首个出现位置）
    const pendingLocs = new Map();
    const pending = {
        add (uuid, loc) {
            if (!pendingLocs.has(uuid)) pendingLocs.set(uuid, loc);
        },
    };

    const targets = walkDir(assetsDir, n => n.endsWith('.prefab') || n.endsWith('.fire'));
    const all = [];
    for (const file of targets) {
        const rel = path.relative(assetsDir, file).replace(/\\/g, '/');
        try {
            all.push(...scanFile(file, rel, index, scriptInfo, pending, options));
        } catch (e) {
            all.push({ file: rel, node: '', component: '', level: 'error', message: '扫描异常: ' + e.message });
        }
    }

    // 对疑似缺失的 uuid 做兜底确认（内置资源）
    if (pendingLocs.size > 0 && typeof resolveUuids === 'function') {
        let existing = new Set();
        try {
            existing = await resolveUuids([...pendingLocs.keys()]) || new Set();
        } catch (e) { /* 兜底失败则全部按缺失报告 */ }
        for (const [uuid, loc] of pendingLocs) {
            if (!existing.has(uuid)) {
                all.push({
                    file: loc.file,
                    node: loc.node,
                    component: loc.component,
                    level: 'error',
                    message: `引用的资源不存在（uuid: ${uuid}），资源可能已丢失或被替换`,
                });
            }
        }
    }

    const order = { error: 0, warning: 1, info: 2 };
    all.sort((a, b) => (order[a.level] - order[b.level]) || a.file.localeCompare(b.file));
    return {
        results: all,
        stats: {
            files: targets.length,
            errors: all.filter(r => r.level === 'error').length,
            warnings: all.filter(r => r.level === 'warning').length,
            infos: all.filter(r => r.level === 'info').length,
        },
    };
}

module.exports = { scanProject, scanFile, compressUuid, looksLikeScriptUuid, buildAssetIndex, buildScriptInfo, parseRefProperties };
