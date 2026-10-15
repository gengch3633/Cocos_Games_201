'use strict';

// 离线自测：node test/selftest.js [assetsDir]
const path = require('path');
const scanner = require('../lib/scanner');

// 1. uuid 压缩算法验证
const cases = [
    ['9f056ddc-19e5-4102-a850-1f46b65566b0', '9f0563cGeVBAqhQH0a2VWaw'],
    ['75b0a9db-b49a-401b-8fb0-f893edb87204', '75b0anbtJpAG4+w+JPtuHIE'],
];
let ok = true;
for (const [full, compressed] of cases) {
    const got = scanner.compressUuid(full);
    const pass = got === compressed;
    ok = ok && pass;
    console.log(`${pass ? 'PASS' : 'FAIL'} compressUuid(${full}) = ${got}${pass ? '' : ' (期望 ' + compressed + ')'}`);
}
if (!ok) process.exit(1);

// 2. 全量扫描
const assetsDir = process.argv[2] || path.join(__dirname, '..', '..', '..', 'assets');
console.log('\n扫描目录:', assetsDir);
const t0 = Date.now();
scanner.scanProject(assetsDir, async () => new Set(), { checkProps: true }).then(({ results, stats }) => {
    console.log(`耗时 ${Date.now() - t0}ms`);
    console.log(`文件 ${stats.files} | 错误 ${stats.errors} | 警告 ${stats.warnings} | 提示 ${stats.infos}`);
    const show = results.filter(r => r.level !== 'info').slice(0, 40);
    for (const r of show) {
        console.log(`\n[${r.level}] ${r.file}`);
        if (r.node) console.log(`  节点: ${r.node}`);
        if (r.component) console.log(`  组件: ${r.component}`);
        console.log(`  ${r.message}`);
    }
    if (results.length > show.length) console.log(`\n... 其余 ${results.length - show.length} 条省略`);
});
