'use strict';

var path = require('path');
var internalScanner = require('./lib/internalScanner');
var uuidReplacer = require('./lib/uuidReplacer');

var cachedScanResult = null;

function getProjectPath() {
    if (typeof Editor !== 'undefined' && Editor.Project && Editor.Project.path) {
        return Editor.Project.path;
    }
    return path.join(__dirname, '..', '..');
}

function scanResources() {
    var projectPath = getProjectPath();
    var internalScan = internalScanner.scanInternalResources({
        editorAppPath: typeof Editor !== 'undefined' && Editor.App ? Editor.App.path : null,
        projectPath: projectPath,
    });
    var projectScan = internalScanner.scanProjectAssets(projectPath);
    var replacement = internalScanner.buildReplacementMap(internalScan, projectScan);

    cachedScanResult = {
        projectPath: projectPath,
        internalScan: internalScan,
        projectScan: projectScan,
        replacement: replacement,
    };

    return cachedScanResult;
}

function runReplace() {
    if (!cachedScanResult) {
        scanResources();
    }

    var projectPath = cachedScanResult.projectPath;
    var uuidMap = cachedScanResult.replacement.map;
    var assetsDir = path.join(projectPath, 'assets');
    var changedFiles = uuidReplacer.replaceInDirectory(assetsDir, uuidMap);

    if (typeof Editor !== 'undefined' && Editor.assetdb && Editor.assetdb.refresh) {
        Editor.assetdb.refresh('db://assets', function () {
            Editor.log('[replace-with-internal] 资源刷新完成，修改文件数: ' + changedFiles.length);
        });
    }

    return {
        pairCount: cachedScanResult.replacement.pairs.length,
        changedFileCount: changedFiles.length,
        changedFiles: changedFiles,
        pairs: cachedScanResult.replacement.pairs,
    };
}

module.exports = {
    load: function () {
        Editor.log('[replace-with-internal] 插件已加载');
    },

    unload: function () {
        cachedScanResult = null;
    },

    messages: {
        'open-panel': function () {
            Editor.Panel.open('replace-with-internal');
        },

        'scan': function (event) {
            try {
                var result = scanResources();
                if (event.reply) {
                    event.reply(null, {
                        internalCount: result.internalScan.entries.length,
                        projectCount: result.projectScan.entries.length,
                        pairCount: result.replacement.pairs.length,
                        internalRoot: result.internalScan.rootDir,
                        internalSource: result.internalScan.source,
                        pairs: result.replacement.pairs,
                    });
                }
            } catch (error) {
                Editor.error('[replace-with-internal] 扫描失败: ' + error.message);
                if (event.reply) {
                    event.reply(error);
                }
            }
        },

        'replace': function (event) {
            try {
                var result = runReplace();
                if (event.reply) {
                    event.reply(null, result);
                }
            } catch (error) {
                Editor.error('[replace-with-internal] 替换失败: ' + error.message);
                if (event.reply) {
                    event.reply(error);
                }
            }
        },
    },
};
