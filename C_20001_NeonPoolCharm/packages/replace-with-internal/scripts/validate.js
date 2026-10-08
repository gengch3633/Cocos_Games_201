'use strict';

var fs = require('fs');
var path = require('path');

var packageRoot = path.join(__dirname, '..');
var projectRoot = path.join(packageRoot, '..', '..');
var errors = [];
var warnings = [];

function assertFile(relativePath) {
    var fullPath = path.join(packageRoot, relativePath);
    if (!fs.existsSync(fullPath)) {
        errors.push('缺少文件: ' + relativePath);
        return false;
    }
    return true;
}

function validatePackageJson() {
    var pkgPath = path.join(packageRoot, 'package.json');
    var pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

    if (pkg.name !== 'replace-with-internal') {
        errors.push('package.json name 应为 replace-with-internal');
    }
    if (pkg.main !== 'main.js') {
        errors.push('package.json main 应为 main.js');
    }
    if (!pkg.panel || pkg.panel.main !== 'panel/index.js') {
        errors.push('package.json 缺少 panel 配置');
    }

    var menu = pkg['main-menu'] || {};
    var menuKeys = Object.keys(menu);
    var openPanelMessage = null;
    menuKeys.forEach(function (key) {
        if (menu[key].message === 'replace-with-internal:open-panel') {
            openPanelMessage = menu[key].message;
        }
    });
    if (!openPanelMessage) {
        errors.push('main-menu 未注册 replace-with-internal:open-panel 消息');
    }

    return pkg;
}

function validateMainJs() {
    var mainPath = path.join(packageRoot, 'main.js');
    var content = fs.readFileSync(mainPath, 'utf-8');
    if (content.indexOf("'open-panel'") < 0) {
        errors.push('main.js 缺少 open-panel 消息处理');
    }
    if (content.indexOf("Editor.Panel.open('replace-with-internal')") < 0) {
        errors.push("main.js 未调用 Editor.Panel.open('replace-with-internal')");
    }
}

function validateScanLogic() {
    var internalScanner = require('../lib/internalScanner');
    var result = internalScanner.scanInternalResources({
        projectPath: projectRoot,
    });

    if (result.entries.length === 0) {
        warnings.push('library fallback 未扫描到 internal 资源，请确认项目已用 Cocos Creator 打开过');
        return;
    }

    var projectScan = internalScanner.scanProjectAssets(projectRoot);
    var replacement = internalScanner.buildReplacementMap(result, projectScan);

    console.log('[scan] internal 来源: ' + result.source);
    console.log('[scan] internal 资源数: ' + result.entries.length);
    console.log('[scan] 项目 meta 资源数: ' + projectScan.entries.length);
    console.log('[scan] 可替换 UUID 组数: ' + replacement.pairs.length);

    replacement.pairs.slice(0, 10).forEach(function (pair) {
        console.log('  ' + pair.name + ': ' + pair.fromUuid + ' -> ' + pair.toUuid);
    });

    if (replacement.pairs.length === 0) {
        warnings.push('未发现可替换的同名 internal 资源');
    }
}

function main() {
    [
        'main.js',
        'panel/index.js',
        'lib/uuidUtils.js',
        'lib/metaParser.js',
        'lib/internalScanner.js',
        'lib/uuidReplacer.js',
        'lib/libraryFallback.js',
    ].forEach(assertFile);

    validatePackageJson();
    validateMainJs();
    validateScanLogic();

    if (warnings.length > 0) {
        console.log('\nWarnings:');
        warnings.forEach(function (item) {
            console.log('  - ' + item);
        });
    }

    if (errors.length > 0) {
        console.error('\nValidation FAILED:');
        errors.forEach(function (item) {
            console.error('  - ' + item);
        });
        process.exit(1);
    }

    console.log('\nValidation PASSED');
    console.log('可在 Cocos Creator 中通过以下方式打开面板:');
    console.log('  菜单: 扩展 -> Replace With Internal');
    console.log('  消息: replace-with-internal:open-panel');
    console.log('  面板: Editor.Panel.open("replace-with-internal")');
}

main();
