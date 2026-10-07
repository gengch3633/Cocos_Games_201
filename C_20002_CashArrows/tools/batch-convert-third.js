/**
 * Batch convert webpack ES5 JS in assets/scripts/third to TypeScript.
 */
const fs = require("fs");
const path = require("path");

const THIRD = path.join(__dirname, "../assets/scripts/third");

const FILES = [
    "ts.js",
    "unit-base.js",
    "node-mem-pool.js",
    "node-unit.js",
    "node.js",
    "render-component.js",
    "render-flow.js",
    "sortingDefine.js",
    "time.js",
    "spine-assembler.js",
    "resultView.js",
    "snake.js",
    "withMoodView.js",
];

function moduleToImportName(modulePath) {
    let name = modulePath.replace(/\.js$/, "");
    if (name.includes("-")) {
        name = name.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
    }
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function moduleToFilePath(modulePath) {
    return "./" + modulePath.replace(/\.js$/, "");
}

function collectRequires(src) {
    const map = new Map();
    const re = /(\w+)\s*=\s*(?:\(\s*)?e\("([^"]+)"\)/g;
    let m;
    while ((m = re.exec(src)) !== null) {
        const alias = m[1];
        const mod = m[2];
        if (mod === "MultiPlatform" || mod === "MultiPlatform.js") continue;
        if (!map.has(alias)) {
            map.set(alias, {
                modulePath: mod,
                importName: moduleToImportName(mod),
                filePath: moduleToFilePath(mod),
            });
        }
    }
    // side-effect only: e("index").NodeMemPool or e("index")
    const sideRe = /e\("([^"]+)"\)(?:\.\w+)?;/g;
    while ((m = sideRe.exec(src)) !== null) {
        const mod = m[1];
        const fp = moduleToFilePath(mod);
        if (![...map.values()].some((v) => v.filePath === fp)) {
            map.set("__side_" + mod, {
                modulePath: mod,
                importName: moduleToImportName(mod),
                filePath: fp,
                sideEffect: true,
            });
        }
    }
    return map;
}

function buildImports(requireMap, extraNamed = []) {
    const byPath = new Map();
    for (const info of requireMap.values()) {
        if (info.sideEffect) {
            byPath.set(info.filePath, { sideEffect: true });
        } else if (!byPath.has(info.filePath)) {
            byPath.set(info.filePath, { importName: info.importName });
        }
    }
    const lines = [...byPath.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([fp, info]) => {
            if (info.sideEffect) return `import "${fp}";`;
            return `import ${info.importName} from "${fp}";`;
        });
    for (const named of extraNamed.sort((a, b) => a.localeCompare(b))) {
        const m = named.match(/^(\{[^}]+\}) from "(.+)"$/);
        if (m && !lines.some((l) => l.includes(m[2]))) {
            lines.push(`import ${named};`);
        }
    }
    lines.sort((a, b) => a.localeCompare(b));
    return lines.length ? lines.join("\n") + "\n\n" : "";
}

function stripBoilerplate(src) {
    let s = src;
    s = s.replace(/^let e = require;\s*\nlet t = module;\s*\n(?:let i = exports;\s*\n)?/m, "");
    s = s.replace(/^"use strict";\s*\n/m, "");
    s = s.replace(/cc\._RF\.push\([^)]+\);\s*\n/g, "");
    s = s.replace(/cc\._RF\.pop\(\);\s*\n?$/m, "");
    s = s.replace(/Object\.defineProperty\(i, "__esModule", \{\s*value: ! ?0\s*\}\);\s*\n/g, "");
    s = s.replace(/t\.exports = [\s\S]*;\s*\n?/g, "");
    s = s.replace(/t\.exports\.default = [\s\S]*;\s*\n?/g, "");
    s = s.replace(/i\.default = [\s\S]*;\s*\n?$/m, "");
    return s;
}

function replaceDefaultRefs(src, requireMap) {
    let s = src;
    for (const [alias, info] of requireMap) {
        if (alias.startsWith("__side_")) continue;
        s = s.replace(new RegExp("\\b" + alias + "\\.default\\b", "g"), info.importName);
        // module object exports like g.default||g -> NewbieGuideFlow
        s = s.replace(new RegExp("\\b" + alias + "\\.default\\|\\|" + alias + "\\b", "g"), info.importName);
    }
    // l.formatCurrency -> LanguageService.formatCurrency (bare module refs)
    for (const [alias, info] of requireMap) {
        if (alias.startsWith("__side_")) continue;
        s = s.replace(new RegExp("\\b" + alias + "\\.(\\w+)", "g"), info.importName + ".$1");
    }
    return s;
}

function removeRequireLines(src) {
    return src
        .replace(/(?:var|let|const)\s+[\w,\s=]*e\("[^"]+"\)[^;]*;\s*\n/g, "")
        .replace(/^\s*e\("[^"]+"\)[^;]*;\s*\n/gm, "");
}

function convertDecorators(src) {
    let s = src;
    s = s.replace(
        /var\s+\w+\s*=\s*cc\._decorator,\s*\n\s*\w+\s*=\s*\w+\.ccclass,\s*\n(?:\s*\w+\s*=\s*\w+\.property(?:,\s*\n\s*\w+\s*=\s*\w+\.menu)?;\s*\n)?/g,
        ""
    );
    s = s.replace(/var\s+\w+\s*=\s*cc\._decorator,\s*\n\s*\w+\s*=\s*\w+\.ccclass;\s*\n\s*\w+\.property;\s*\n/g, "");
    s = s.replace(/var\s+\w+\s*=\s*__extends,\s*\n\s*\w+\s*=\s*__decorate;\s*\n(?:__awaiter,\s*\n__generator;\s*\n)?/g, "");
    s = s.replace(/var\s+\w+\s*=\s*__extends,\s*\n\s*\w+\s*=\s*__decorate;\s*\n/g, "");
    s = s.replace(/var\s+\w+\s*=\s*__extends,\s*\n\s*\w+\s*=\s*__awaiter,\s*\n\s*\w+\s*=\s*__generator,\s*\n\s*\w+\s*=\s*__decorate;\s*\n/g, "");
    s = s.replace(/var\s+\w+\s*=\s*__extends,\s*\n\s*\w+\s*=\s*__decorate,\s*\n\s*\w+\s*=\s*__awaiter,\s*\n\s*\w+\s*=\s*__generator;\s*\n/g, "");
    s = s.replace(/var\s+\w+\s*=\s*__extends;\s*\n/g, "");
    s = s.replace(/var\s+\w+\s*=\s*__spreadArrays;\s*\n/g, "");
    return s;
}

function convertEnumBlocks(src, prefix = "export ") {
    // (function(e){ e[e.X=0]="X"; })(i.SortingLayer||(i.SortingLayer={}));
    return src.replace(
        /\(function\s*\(\s*(\w+)\s*\)\s*\{([\s\S]*?)\}\s*\)\s*\(\s*(\w+)\.(\w+)\s*\|\|\s*\(\s*\3\.\4\s*=\s*\{\s*\}\s*\)\s*\)/g,
        (match, param, body, mod, name) => {
            const entries = [];
            const re = new RegExp(param + "\\[\\s*" + param + "\\.(\\w+)\\s*=\\s*([^\\]]+)\\]\\s*=\\s*\"([^\"]+)\"", "g");
            let m;
            while ((m = re.exec(body)) !== null) {
                entries.push(`    ${m[1]} = ${m[2].trim()},`);
            }
            return `${prefix}enum ${name} {\n${entries.join("\n")}\n}`;
        }
    );
}

function convertExportsConst(src) {
    return src.replace(/i\.(\w+)\s*=\s*([^;]+);/g, "export const $1 = $2;");
}

function convertCcClass(src, className) {
    if (!src.includes("cc.Class({")) return null;
    // Keep cc.Class structure but wrap - manual for withMoodView is too complex; emit as @ccclass class
    return null;
}

function convertWebpackComponent(src, exportName, options = {}) {
    const { menu, properties = [] } = options;
    const classRe = new RegExp(
        "var\\s+(\\w+)\\s*=\\s*function\\s*\\(\\s*(\\w+)\\s*\\)\\s*\\{\\s*function\\s+(\\w+)\\s*\\(\\)\\s*\\{([\\s\\S]*?)\\}\\s*\\n\\s*\\w+\\(\\3,\\s*\\2\\);([\\s\\S]*?)return\\s+\\w+\\(\\[([^\\]]+)\\],\\s*\\3\\);\\s*\\}\\s*\\(cc\\.Component\\);",
        "m"
    );
    const m = src.match(classRe);
    if (!m) return null;

    const [, , , , ctorBody, methodsBlock, decorators] = m;
    let props = "";
    const propInit = ctorBody.trim();
    const propLines = propInit.split(";").filter(Boolean);
    for (const line of propLines) {
        const pm = line.trim().match(/t\.(\w+)\s*=\s*(.+)/);
        if (pm) {
            props += `    ${pm[1]}: any = ${pm[2]};\n`;
        }
    }

    let methods = methodsBlock.replace(/\bt\.prototype\.(\w+)\s*=\s*function\s*\(([^)]*)\)\s*\{/g, "$1($2) {");
    methods = methods.replace(/\bt\.prototype\.(\w+)\s*=\s*function\s*\(\)\s*\{/g, "$1() {");

    const decMatch = decorators.match(/@?\w+\(\[(\w+)\(([^)]*)\)\],\s*t\.prototype,\s*"(\w+)"/g) || [];
    const propDecs = {};
    for (const d of decMatch) {
        const dm = d.match(/(\w+)\(([^)]*)\)[^"]+"(\w+)"/);
        if (dm) propDecs[dm[3]] = dm[2];
    }
    // rebuild property decorators from r([v(sp.Skeleton)], ...)
    const decRe = /\w+\(\[(\w+)\(([^)]*)\)\],\s*t\.prototype,\s*"(\w+)"/g;
    let dm;
    while ((dm = decRe.exec(methodsBlock + decorators)) !== null) {
        propDecs[dm[3]] = dm[2] || "";
    }
    const decRe2 = /\w+\(\[(\w+)\(([^)]*)\)\],\s*t\.prototype,\s*"(\w+)"/g;
    while ((dm = decRe2.exec(src)) !== null) {
        propDecs[dm[3]] = dm[2] || "";
    }

    let propsWithDec = "";
    for (const [name, typeArg] of Object.entries(propDecs)) {
        propsWithDec += `    @property(${typeArg})\n    ${name}: any = null;\n\n`;
    }

    const menuDec = menu ? `@menu("${menu}")\n` : "";
    return `@ccclass\n${menuDec}export default class ${exportName} extends cc.Component {\n${propsWithDec || props}\n${methods}\n}\n`;
}

function convertSimpleClass(src, exportName, baseImport) {
    // prototype inheritance: var a = function(e){ n.call(this,e); }; ... t.exports = a;
    const re = new RegExp(
        "var\\s+\\w+,\\s*\\n\\s*" + baseImport.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[\\s\\S]*?var\\s+(\\w+)\\s*=\\s*function\\s*\\(([^)]*)\\)\\s*\\{([\\s\\S]*?)\\};[\\s\\S]*?\\(i\\s*=\\s*function\\(\\)\\s*\\{\\s*\\}\\)\\.prototype\\s*=\\s*" + baseImport + "\\.prototype;[\\s\\S]*?(\\w+)\\.prototype\\s*=\\s*new\\s+i\\(\\);([\\s\\S]*?)t\\.exports",
        "m"
    );
    return null;
}

function convertUnitBase(src) {
    const body = src.replace(/var\s+i\s*=\s*function/, "class UnitBase");
    return body
        .replace(/,\s*\n\s*n\s*=\s*i\.prototype;/, " {")
        .replace(/n\.(\w+)\s*=\s*function\s*\(([^)]*)\)\s*\{/g, "$1($2) {")
        .replace(/t\.exports\s*=\s*i;?/g, "")
        + "\nexport default UnitBase;\n";
}

function processFile(filename) {
    const inputPath = path.join(THIRD, filename);
    const outputPath = path.join(THIRD, filename.replace(/\.js$/, ".ts"));
    let src = fs.readFileSync(inputPath, "utf8");

    if (filename === "ts.js") {
        fs.writeFileSync(outputPath, "export {};\n", "utf8");
        return { file: outputPath, bytes: 11, imports: 0 };
    }

    if (filename === "render-component.js") {
        fs.writeFileSync(outputPath, 'console.log("空文件");\n', "utf8");
        return { file: outputPath, bytes: 20, imports: 0 };
    }

    const requireMap = collectRequires(src);
    let body = stripBoilerplate(src);
    body = convertDecorators(body);
    body = removeRequireLines(body);
    body = replaceDefaultRefs(body, requireMap);

    let header = "";
    let footer = "";
    let extraNamed = [];

    if (filename === "sortingDefine.js") {
        body = convertEnumBlocks(body);
        body = convertExportsConst(body);
        body = body.replace(/i\.(\w+)\s*\|\|\s*\(\s*i\.\1\s*=\s*\{\s*\}\s*\)/g, "");
        fs.writeFileSync(outputPath, body.trim() + "\n", "utf8");
        return { file: outputPath, bytes: body.length, imports: 0 };
    }

    if (filename === "unit-base.js") {
        let out = `export default class UnitBase {
    unitID: number;
    _memPool: any;
    _data: Uint16Array;
    _contentNum: number;
    _signData: Uint16Array;
    _spacesData: any[];

    constructor(unitID: number, memPool: any, contentNum?: number) {
        contentNum = contentNum || 128;
        this.unitID = unitID;
        this._memPool = memPool;
        this._data = new Uint16Array(2);
        this._data[0] = 0;
        this._data[1] = 0;
        this._contentNum = contentNum;
        this._signData = new Uint16Array(2 * this._contentNum);
        this._spacesData = [];
        for (let n = 0; n < contentNum; n++) {
            const a = 2 * n;
            this._signData[a + 0] = n + 1;
            this._signData[a + 1] = 0;
            this._spacesData[n] = { index: n, unitID: unitID };
        }
        this._signData[2 * (contentNum - 1)] = 65535;
    }

    hasSpace(): boolean {
        return this._data[0] !== 65535;
    }

    isAllFree(): boolean {
        return this._data[1] === 0;
    }

    pop(): any {
        const e = this._data[0];
        if (e === 65535) return null;
        const t = e;
        const i = 2 * t;
        const n = this._spacesData[t];
        this._signData[i + 1] = 1;
        this._data[0] = this._signData[i + 0];
        this._data[1]++;
        return n;
    }

    push(index: number): void {
        const t = 2 * index;
        this._signData[t + 1] = 0;
        this._signData[t + 0] = this._data[0];
        this._data[0] = index;
        this._data[1]--;
    }

    dump(): void {
        let e = 0;
        let t = this._data[0];
        let i = "";
        while (t !== 65535) {
            e++;
            i += t + "->";
            t = this._signData[2 * t + 0];
        }
        let n = 0;
        let a = "";
        const o = this._contentNum;
        for (let r = 0; r < o; r++) {
            if (this._signData[2 * r + 1] === 1) {
                n++;
                a += r + "->";
            }
        }
        const s = e + n;
        console.log("unitID:", this.unitID, "spaceNum:", e, "calc using num:", n, "store using num:", this._data[1], "calc total num:", s, "actually total num:", this._contentNum);
        console.log("free info:", i);
        console.log("using info:", a);
        if (n !== this._data[1]) cc.error("using num error", "calc using num:", n, "store using num:", this._data[1]);
        if (e + n !== this._contentNum) cc.error("total num error", "calc total num:", s, "actually total num:", this._contentNum);
    }
}
`;
        fs.writeFileSync(outputPath, out, "utf8");
        return { file: outputPath, bytes: out.length, imports: 0 };
    }

    if (filename === "node-mem-pool.js") {
        const out = `import MemPool from "./mem-pool";

export default class NodeMemPool extends MemPool {
    _initNative(): void {
        this._nativeMemPool = new (renderer as any).NodeMemPool();
    }

    _destroyUnit(unitID: number): void {
        super._destroyUnit(unitID);
    }
}
`;
        fs.writeFileSync(outputPath, out, "utf8");
        return { file: outputPath, bytes: out.length, imports: 1 };
    }

    if (filename === "node-unit.js") {
        const out = `import UnitBase from "./unit-base";

export default class NodeUnit extends UnitBase {
    trsList: Float64Array;
    localMatList: Float64Array;
    worldMatList: Float64Array;

    constructor(unitID: number, memPool: any, contentNum?: number) {
        super(unitID, memPool, contentNum);
        const i = this._contentNum;
        this.trsList = new Float64Array(10 * i);
        this.localMatList = new Float64Array(16 * i);
        this.worldMatList = new Float64Array(16 * i);
        for (let o = 0; o < i; o++) {
            const r = this._spacesData[o];
            r.trs = new Float64Array(this.trsList.buffer, 80 * o, 10);
            r.localMat = new Float64Array(this.localMatList.buffer, 128 * o, 16);
            r.worldMat = new Float64Array(this.worldMatList.buffer, 128 * o, 16);
        }
    }
}
`;
        fs.writeFileSync(outputPath, out, "utf8");
        return { file: outputPath, bytes: out.length, imports: 1 };
    }

    if (filename === "node.js") {
        const out = `import "./index";

declare interface NodeSortingExt {
    _sortingPriority?: number;
    _sortingEnabled?: boolean;
    sortingPriority: number;
    sortingEnabled: boolean;
}

if (!("sortingPriority" in cc.Node.prototype)) {
    Object.defineProperty(cc.Node.prototype, "sortingPriority", {
        get: function (this: cc.Node & NodeSortingExt) {
            return this._sortingPriority;
        },
        set: function (this: cc.Node & NodeSortingExt, value: number) {
            this._sortingPriority = value;
        },
        enumerable: true,
    });
    Object.defineProperty(cc.Node.prototype, "sortingEnabled", {
        get: function (this: cc.Node & NodeSortingExt) {
            return this._sortingEnabled;
        },
        set: function (this: cc.Node & NodeSortingExt, value: boolean) {
            this._sortingEnabled = value;
        },
        enumerable: true,
    });
}
`;
        fs.writeFileSync(outputPath, out, "utf8");
        return { file: outputPath, bytes: out.length, imports: 1 };
    }

    if (filename === "time.js") {
        const out = `const { ccclass } = cc._decorator;

@ccclass
export default class Time extends cc.Component {
    start(): void {
        cc.game.addPersistRootNode(this.node);
    }

    update(): void {
    }
}
`;
        fs.writeFileSync(outputPath, out, "utf8");
        return { file: outputPath, bytes: out.length, imports: 0 };
    }

    // Generic: keep body with @ts-nocheck for complex patches
    if (["render-flow.js", "spine-assembler.js"].includes(filename)) {
        header = "// @ts-nocheck\n";
    }

    if (filename === "snake.js") {
        extraNamed.push('{ ClickState } from "./game"');
        body = convertEnumBlocks(body);
        body = body.replace(/i\.default = \w+;\s*\n?/g, "");
    }

    if (filename === "resultView.js") {
        body = body.replace(/i\.default = \w+;\s*\n?/g, "");
    }

    if (filename === "withMoodView.js") {
        // converted separately - use body cleanup only
        body = body.replace(/i\.default = \w+;\s*\n?/g, "");
        body = body.replace(/cc\.Class\(\{[\s\S]*$/m, "PLACEHOLDER_CC_CLASS");
    }

    const imports = buildImports(requireMap, extraNamed);
    const hasDecorator = src.includes("cc._decorator") || src.includes("@ccclass");
    if (hasDecorator && !header.includes("ccclass")) {
        header += "const { ccclass, property, menu } = cc._decorator;\n\n";
    }

    let output = header + imports + body.trim() + "\n";
    if (footer) output += footer;

    fs.writeFileSync(outputPath, output, "utf8");
    return { file: outputPath, bytes: output.length, imports: requireMap.size };
}

const results = [];
for (const f of FILES) {
    try {
        results.push({ name: f, ...processFile(f), ok: true });
    } catch (err) {
        results.push({ name: f, ok: false, error: err.message });
    }
}
console.log(JSON.stringify(results, null, 2));
