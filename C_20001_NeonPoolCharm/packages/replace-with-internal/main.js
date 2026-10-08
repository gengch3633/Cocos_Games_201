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

function runReplace(selectedIds) {
    if (!cachedScanResult) {
        scanResources();
    }

    var selectedPairs = internalScanner.filterPairsByIds(
        cachedScanResult.replacement.pairs,
        selectedIds
    );

    if (selectedPairs.length === 0) {
        return {
            pairCount: 0,
            changedFileCount: 0,
            changedFiles: [],
            pairs: [],
            message: '未选择任何替换项',
        };
    }

    var uuidMap = internalScanner.buildMapFromPairs(selectedPairs);
    var assetsDir = path.join(cachedScanResult.projectPath, 'assets');
    var changedFiles = uuidReplacer.replaceReferencesInDirectory(assetsDir, uuidMap);

    if (typeof Editor !== 'undefined' && Editor.assetdb && Editor.assetdb.refresh) {
        Editor.assetdb.refresh('db://assets', function () {
            Editor.log(
                '[replace-with-internal] 引用替换完成，修改预制体/场景文件数: ' +
                changedFiles.length
            );
        });
    }

    return {
        pairCount: selectedPairs.length,
        changedFileCount: changedFiles.length,
        changedFiles: changedFiles,
        pairs: selectedPairs,
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
                        categories: result.replacement.categories,
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

        'replace': function (event, selectedIds) {
            try {
                var result = runReplace(selectedIds);
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
