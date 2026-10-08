'use strict';

var fs = require('fs');
var path = require('path');
var metaParser = require('./metaParser');
var libraryFallback = require('./libraryFallback');
var categoryUtils = require('./categoryUtils');

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

function scanMetaDirectory(rootDir, options) {
    options = options || {};
    var entries = [];
    var baseDir = options.baseDir || rootDir;

    walkMetaFiles(rootDir, function (metaPath) {
        var metaJson = readMetaFile(metaPath);
        if (!metaJson) {
            return;
        }
        var relativePath = path.relative(baseDir, metaPath).replace(/\\/g, '/');
        metaParser.collectMetaEntries(metaJson, metaPath, entries, {
            category: categoryUtils.getCategoryFromPath(relativePath),
        });
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
        var result = scanMetaDirectory(dir, { baseDir: dir });
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
    return scanMetaDirectory(assetsDir, { baseDir: assetsDir });
}

function isProjectInternalCandidate(sourcePath) {
    var normalized = sourcePath.replace(/\\/g, '/').toLowerCase();
    if (normalized.indexOf('/internal/') >= 0) {
        return true;
    }
    if (normalized.indexOf('/unkown/default_') >= 0) {
        return true;
    }
    if (normalized.indexOf('/unkown_effect/') >= 0) {
        return true;
    }
    if (normalized.indexOf('/unkown_material/') >= 0) {
        return true;
    }
    var assetPath = normalized.replace(/\.meta$/i, '');
    var baseName = path.basename(assetPath, path.extname(assetPath));
    if (baseName.indexOf('default_') === 0) {
        return true;
    }
    if (baseName.indexOf('builtin-') === 0) {
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
    if (sameKind.length >= 1) {
        return sameKind[0];
    }

    if (internalItems.length === 1) {
        return internalItems[0];
    }

    return null;
}

function makePairId(category, name, kind, fromUuid) {
    return category + '::' + name + '::' + kind + '::' + fromUuid;
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

            var category = internalItem.category || categoryUtils.getCategoryFromPath(internalItem.sourcePath);
            var pair = {
                id: makePairId(category, name, projectItem.kind, projectItem.uuid),
                name: name,
                kind: projectItem.kind,
                kindLabel: categoryUtils.getKindLabel(projectItem.kind),
                category: category,
                categoryLabel: categoryUtils.getCategoryLabel(category),
                fromUuid: projectItem.uuid,
                toUuid: internalItem.uuid,
                projectPath: projectItem.sourcePath,
                internalPath: internalItem.sourcePath,
            };

            map[projectItem.uuid] = internalItem.uuid;
            pairs.push(pair);
        });
    });

    return {
        map: map,
        pairs: pairs,
        categories: categoryUtils.groupPairsByCategory(pairs),
    };
}

function buildMapFromPairs(pairs) {
    var map = {};
    pairs.forEach(function (pair) {
        map[pair.fromUuid] = pair.toUuid;
    });
    return map;
}

function filterPairsByIds(allPairs, selectedIds) {
    if (!selectedIds || selectedIds.length === 0) {
        return [];
    }
    var idSet = {};
    selectedIds.forEach(function (id) {
        idSet[id] = true;
    });
    return allPairs.filter(function (pair) {
        return idSet[pair.id];
    });
}

module.exports = {
    scanInternalResources: scanInternalResources,
    scanProjectAssets: scanProjectAssets,
    buildReplacementMap: buildReplacementMap,
    buildMapFromPairs: buildMapFromPairs,
    filterPairsByIds: filterPairsByIds,
    isProjectInternalCandidate: isProjectInternalCandidate,
    scanMetaDirectory: scanMetaDirectory,
    scanEditorInternalFromDisk: scanEditorInternalFromDisk,
    getEditorInternalDirs: getEditorInternalDirs,
};
