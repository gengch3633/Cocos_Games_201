'use strict';
// 输出全部 warning + info 分类统计: node test/dump.js [assetsDir]
const path = require('path');
const scanner = require('../lib/scanner');

const assetsDir = process.argv[2] || path.join(__dirname, '..', '..', '..', 'assets');
scanner.scanProject(assetsDir, async () => new Set(), { checkProps: true }).then(({ results, stats }) => {
    console.log(`文件 ${stats.files} | 错误 ${stats.errors} | 警告 ${stats.warnings} | 提示 ${stats.infos}`);
    console.log('\n=== WARNINGS ===');
    for (const r of results.filter(r => r.level === 'warning')) {
        console.log(`${r.file}\n  节点: ${r.node}\n  组件: ${r.component}\n  ${r.message}\n`);
    }
    console.log('=== INFO 分类统计 ===');
    const byMsg = new Map();
    for (const r of results.filter(r => r.level === 'info')) {
        const key = r.message.replace(/"[^"]*"/g, '"X"').replace(/@property \w+/, '@property N');
        byMsg.set(key, (byMsg.get(key) || 0) + 1);
    }
    for (const [k, v] of [...byMsg.entries()].sort((a, b) => b[1] - a[1])) {
        console.log(`${String(v).padStart(4)}  ${k}`);
    }
    console.log('\n=== ERROR 样例（按 uuid 去重后前 10 个缺失资源） ===');
    const seen = new Set();
    let n = 0;
    for (const r of results) {
        if (r.level !== 'error') continue;
        const m = /uuid: ([0-9a-f-]+)/.exec(r.message);
        const key = m ? m[1] : r.message;
        if (seen.has(key)) continue;
        seen.add(key);
        if (n++ >= 10) break;
        console.log(`${r.file} | ${r.component} | ${key}`);
    }
});
