'use strict';

const fs = require('fs');
const path = require('path');
const scanner = require('./lib/scanner');

const PKG = 'prefab-ref-checker';

/**
 * 用 assetdb 逐个确认 uuid 是否存在（覆盖 assets 之外的内置资源）。
 * 注意：不用 queryAssetByUuid —— 该异步接口在 2.4 主进程不可靠（回调可能不触发导致扫描挂起）。
 * uuidToUrl 是同步接口，存在返回 db:// 地址，不存在返回 null，内置资源也能解析。
 */
function resolveUuidsWithAssetdb (uuids) {
    const set = new Set();
    if (Editor.assetdb && typeof Editor.assetdb.uuidToUrl === 'function') {
        for (const uuid of uuids) {
            try {
                if (Editor.assetdb.uuidToUrl(uuid)) set.add(uuid);
            } catch (e) { /* 单个失败按缺失处理 */ }
        }
    }
    return Promise.resolve(set);
}

function formatReport (data) {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const ts = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const lines = [
        `引用检查报告  ${ts}`,
        `工程: ${Editor.Project.path}`,
        `扫描文件: ${data.stats.files}    错误: ${data.stats.errors}    警告: ${data.stats.warnings}    提示: ${data.stats.infos}`,
        '',
    ];
    const levelName = { error: '错误', warning: '警告', info: '提示' };
    for (const r of data.results) {
        lines.push(`[${levelName[r.level] || r.level}] ${r.file}`);
        if (r.node) lines.push(`  节点: ${r.node}`);
        if (r.component) lines.push(`  组件: ${r.component}`);
        lines.push(`  问题: ${r.message}`);
        lines.push('');
    }
    return lines.join('\n');
}

module.exports = {
    load () {
        Editor.log('[prefab-ref-checker] main loaded');
    },

    unload () {},

    messages: {
        'open' () {
            Editor.Panel.open(PKG);
        },

        'scan' (event, options) {
            const assetsDir = path.join(Editor.Project.path, 'assets');
            Editor.log('[prefab-ref-checker] 收到扫描请求: ' + assetsDir);
            scanner.scanProject(assetsDir, resolveUuidsWithAssetdb, options || {})
                .then((data) => {
                    const st = data.stats;
                    Editor.log(`[prefab-ref-checker] 扫描完成: 文件 ${st.files}, 错误 ${st.errors}, 警告 ${st.warnings}, 提示 ${st.infos}`);
                    Editor.Ipc.sendToPanel(PKG, `${PKG}:scan-done`, data);
                })
                .catch((e) => {
                    Editor.error('[prefab-ref-checker] 扫描失败: ' + (e.stack || e));
                    Editor.Ipc.sendToPanel(PKG, `${PKG}:scan-done`, {
                        results: [{ file: '', node: '', component: '', level: 'error', message: '扫描失败: ' + e.message }],
                        stats: { files: 0, errors: 1, warnings: 0, infos: 0 },
                    });
                });
        },

        // 在资源管理器中定位资源（面板点击文件名时触发）
        'reveal-asset' (event, relPath) {
            try {
                const url = 'db://assets/' + String(relPath).replace(/\\/g, '/');
                const uuid = Editor.assetdb.urlToUuid(url);
                if (uuid) Editor.Ipc.sendToMain('asset-db:hint', uuid);
            } catch (e) { /* 定位失败忽略 */ }
        },

        'export-report' (event, data) {
            const text = formatReport(data);
            const Electron = require('electron');
            const dialog = Electron.dialog || (Electron.remote && Electron.remote.dialog);
            const defaultPath = path.join(Editor.Project.path, 'temp', 'ref-check-report.txt');
            const doSave = (filePath) => {
                if (!filePath) return;
                try {
                    fs.writeFileSync(filePath, text, 'utf8');
                    Electron.shell.showItemInFolder(filePath);
                    Editor.Ipc.sendToPanel(PKG, `${PKG}:export-done`, filePath);
                } catch (e) {
                    Editor.error(`导出报告失败: ${e.message}`);
                }
            };
            try {
                const ret = dialog.showSaveDialog({
                    title: '导出检查报告',
                    defaultPath,
                    filters: [{ name: 'Text', extensions: ['txt'] }],
                });
                if (ret && typeof ret.then === 'function') {
                    ret.then(r => doSave(r.filePath)).catch(() => {});
                } else {
                    doSave(ret); // 老版本 Electron 同步返回
                }
            } catch (e) {
                // 对话框不可用时直接写入 temp
                doSave(defaultPath);
            }
        },
    },
};
