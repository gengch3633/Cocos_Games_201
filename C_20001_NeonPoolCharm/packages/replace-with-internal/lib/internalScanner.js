'use strict';

var fs = require('fs');
var path = require('path');
var metaParser = require('./metaParser');
var libraryFallback = require('./libraryFallback');

var REPLACE_FILE_EXTS = ['.meta'];

function readMetaFile(metaPath) {
    try {
        return JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    } catch (error) {
        return null;
    }
}

function walkMetaFiles(rootDir, onMeta) {
    if (!rootDir || !fs.existsSync(rootDir)) {
        return;
    }

    function walk(dir) {
        var items;
        try {
            items = fs.readdirSync(dir);
        } catch (error) {
            return;
        }

        items.forEach(function (name) {
            if (name[0] === '.') {
                return;
            }
            var fullPath = path.join(dir, name);
            var stat;
            try {
                stat = fs.statSync(fullPath);
            } catch (error) {
                return;
            }
            if (stat.isDirectory()) {
                walk(fullPath);
            } else if (stat.isFile() && fullPath.endsWith('.meta')) {
                onMeta(fullPath);
            }
        });
    }

    walk(rootDir);
}

function scanMetaDirectory(rootDir) {
    var entries = [];
    walkMetaFiles(rootDir, function (metaPath) {
        var metaJson = readMetaFile(metaPath);
        if (!metaJson) {
            return;
        }
        metaParser.collectMetaEntries(metaJson, metaPath, entries);
    });
    return {
        rootDir: rootDir,
        entries: entries,
        byName: metaParser.indexEntries(entries),
    };
}

function getEditorInternalDirs(editorAppPath) {
    if (!editorAppPath) {
        return [];
    }
    return [
        path.join(editorAppPath, 'resources', 'static', 'default-assets'),
        path.join(editorAppPath, 'resources', 'static', 'internal'),
        path.join(editorAppPath, 'resources', 'engine', 'editor', 'assets', 'default-assets'),
    ];
}

function scanEditorInternalFromDisk(editorAppPath) {
    var dirs = getEditorInternalDirs(editorAppPath);
    var entries = [];
    var usedDir = null;

    dirs.forEach(function (dir) {
        if (usedDir || !fs.existsSync(dir)) {
            return;
        }
        var result = scanMetaDirectory(dir);
        if (result.entries.length > 0) {
            usedDir = dir;
            entries = result.entries;
        }
    });

    return {
        source: 'editor-disk',
        rootDir: usedDir,
        entries: entries,
        byName: metaParser.indexEntries(entries),
    };
}

function queryAssetdbInternal(callback) {
    if (typeof Editor === 'undefined' || !Editor.assetdb || !Editor.assetdb.queryMetas) {
        callback(null, null);
        return;
    }

    var patterns = [
        'db://internal/**',
        'db://internal/resources/**',
        'db://internal/image/**',
    ];
    var patternIndex = 0;
    var collected = [];

    function tryNextPattern() {
        if (patternIndex >= patterns.length) {
            if (collected.length === 0) {
                callback(null, null);
                return;
            }
            callback(null, {
                source: 'assetdb',
                rootDir: 'db://internal',
                entries: collected,
                byName: metaParser.indexEntries(collected),
            });
            return;
        }

        var pattern = patterns[patternIndex++];
        Editor.assetdb.queryMetas(pattern, '*', function (err, metas) {
            if (!err && metas && metas.length > 0) {
                metas.forEach(function (meta) {
                    var url = meta.__url__ || meta.url;
                    if (!url) {
                        return;
                    }
                    Editor.assetdb.loadMeta(url, function (loadErr, metaJson) {
                        if (loadErr || !metaJson) {
                            return;
                        }
                        metaParser.collectMetaEntries(metaJson, url, collected);
                    });
                });
            }
            tryNextPattern();
        });
    }

    tryNextPattern();
}

function scanInternalResources(options) {
    options = options || {};
    var editorAppPath = options.editorAppPath;
    var projectPath = options.projectPath;

    if (typeof Editor !== 'undefined') {
        if (Editor.App && Editor.App.path) {
            editorAppPath = Editor.App.path;
        }
        if (Editor.Project && Editor.Project.path) {
            projectPath = Editor.Project.path;
        }
    }

    if (editorAppPath) {
        var diskResult = scanEditorInternalFromDisk(editorAppPath);
        if (diskResult.entries.length > 0) {
            return diskResult;
        }
    }

    if (projectPath) {
        var libraryResult = libraryFallback.scanFromLibrary(projectPath);
        if (libraryResult && libraryResult.entries.length > 0) {
            return libraryResult;
        }
    }

    return {
        source: 'none',
        rootDir: null,
        entries: [],
        byName: {},
    };
}

function scanProjectAssets(projectPath) {
    var assetsDir = path.join(projectPath, 'assets');
    return scanMetaDirectory(assetsDir);
}

function isProjectInternalCandidate(sourcePath) {
    var normalized = sourcePath.replace(/\\/g, '/').toLowerCase();
    if (normalized.indexOf('/internal/') >= 0) {
        return true;
    }
    if (normalized.indexOf('/unkown/default_') >= 0) {
        return true;
    }
    var baseName = path.basename(normalized);
    if (baseName.indexOf('default_') === 0) {
        return true;
    }
    return false;
}

function pickInternalItem(name, projectItem, internalItems) {
    if (!internalItems || internalItems.length === 0) {
        return null;
    }

    var sameKind = internalItems.filter(function (item) {
        return item.kind === projectItem.kind;
    });
    if (sameKind.length === 1) {
        return sameKind[0];
    }
    if (sameKind.length > 1) {
        return sameKind[0];
    }

    if (internalItems.length === 1) {
        return internalItems[0];
    }

    return null;
}

function buildReplacementMap(internalScan, projectScan) {
    var map = {};
    var pairs = [];

    Object.keys(projectScan.byName).forEach(function (name) {
        var internalItems = internalScan.byName[name];
        if (!internalItems || internalItems.length === 0) {
            return;
        }

        var projectItems = projectScan.byName[name];
        projectItems.forEach(function (projectItem) {
            if (!isProjectInternalCandidate(projectItem.sourcePath)) {
                return;
            }

            var internalItem = pickInternalItem(name, projectItem, internalItems);
            if (!internalItem || projectItem.uuid === internalItem.uuid) {
                return;
            }

            map[projectItem.uuid] = internalItem.uuid;
            pairs.push({
                name: name,
                fromUuid: projectItem.uuid,
                toUuid: internalItem.uuid,
                projectPath: projectItem.sourcePath,
                internalPath: internalItem.sourcePath,
            });
        });
    });

    return {
        map: map,
        pairs: pairs,
    };
}

module.exports = {
    REPLACE_FILE_EXTS: REPLACE_FILE_EXTS,
    scanInternalResources: scanInternalResources,
    scanProjectAssets: scanProjectAssets,
    buildReplacementMap: buildReplacementMap,
    isProjectInternalCandidate: isProjectInternalCandidate,
    scanMetaDirectory: scanMetaDirectory,
    scanEditorInternalFromDisk: scanEditorInternalFromDisk,
    queryAssetdbInternal: queryAssetdbInternal,
    getEditorInternalDirs: getEditorInternalDirs,
};
