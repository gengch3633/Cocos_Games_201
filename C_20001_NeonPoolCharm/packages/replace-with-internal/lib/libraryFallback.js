'use strict';

var fs = require('fs');
var path = require('path');
var metaParser = require('./metaParser');
var categoryUtils = require('./categoryUtils');

var INTERNAL_ROOTS = [
    'effects',
    'image',
    'materials',
    'misc',
    'model',
    'obsolete',
    'particle',
    'prefab',
    'gizmo',
];

function isInternalRelativePath(relativePath) {
    if (!relativePath) {
        return false;
    }
    var normalized = relativePath.replace(/\//g, '\\');
    var parts = normalized.split('\\');

    if (INTERNAL_ROOTS.indexOf(parts[0]) >= 0) {
        return true;
    }

    if (parts[0] === 'resources') {
        if (parts[1] === 'effects' || parts[1] === 'materials') {
            return true;
        }
        if (parts.length >= 2 && parts[1] && parts[1].indexOf('builtin-') === 0) {
            return true;
        }
    }

    return false;
}

function buildProjectUuidSet(uuidToMtime) {
    var projectUuids = {};
    Object.keys(uuidToMtime).forEach(function (uuid) {
        var info = uuidToMtime[uuid];
        if (!info || isInternalRelativePath(info.relativePath)) {
            return;
        }
        projectUuids[uuid] = true;
    });
    return projectUuids;
}

function scanFromLibrary(projectPath) {
    var uuidToMtimePath = path.join(projectPath, 'library', 'uuid-to-mtime.json');
    if (!fs.existsSync(uuidToMtimePath)) {
        return null;
    }

    var uuidToMtime = JSON.parse(fs.readFileSync(uuidToMtimePath, 'utf-8'));
    var entries = [];

    Object.keys(uuidToMtime).forEach(function (uuid) {
        var info = uuidToMtime[uuid];
        if (!info || !isInternalRelativePath(info.relativePath)) {
            return;
        }

        var importPath = path.join(
            projectPath,
            'library',
            'imports',
            uuid.slice(0, 2),
            uuid + '.json'
        );
        var category = categoryUtils.getCategoryFromPath(info.relativePath);

        if (!fs.existsSync(importPath)) {
            entries.push({
                name: path.basename(info.relativePath, path.extname(info.relativePath)),
                uuid: uuid,
                sourcePath: info.relativePath,
                kind: 'texture',
                category: category,
            });
            return;
        }

        try {
            var importJson = JSON.parse(fs.readFileSync(importPath, 'utf-8'));
            var entryKind = metaParser.normalizeKind(importJson.__type__ || 'asset', importJson);
            if (importJson.content && importJson.content.name) {
                entries.push({
                    name: importJson.content.name,
                    uuid: uuid,
                    sourcePath: info.relativePath,
                    kind: entryKind,
                    category: category,
                });
            } else {
                entries.push({
                    name: path.basename(info.relativePath, path.extname(info.relativePath)),
                    uuid: uuid,
                    sourcePath: info.relativePath,
                    kind: entryKind,
                    category: category,
                });
            }
        } catch (error) {
            entries.push({
                name: path.basename(info.relativePath, path.extname(info.relativePath)),
                uuid: uuid,
                sourcePath: info.relativePath,
                kind: 'texture',
                category: category,
            });
        }
    });

    var projectUuids = buildProjectUuidSet(uuidToMtime);
    appendSpriteFramesFromImports(projectPath, entries, projectUuids);

    return {
        source: 'library-fallback',
        rootDir: 'library/uuid-to-mtime.json',
        entries: entries,
        byName: metaParser.indexEntries(entries),
    };
}

function appendSpriteFramesFromImports(projectPath, entries, projectUuids) {
    projectUuids = projectUuids || {};
    var importsDir = path.join(projectPath, 'library', 'imports');
    if (!fs.existsSync(importsDir)) {
        return;
    }

    var internalTextureUuids = {};
    entries.forEach(function (entry) {
        if (entry.kind === 'texture') {
            internalTextureUuids[entry.uuid] = entry.name;
        }
    });

    var existing = {};
    entries.forEach(function (entry) {
        existing[entry.uuid] = true;
    });

    function walk(dir) {
        var items;
        try {
            items = fs.readdirSync(dir);
        } catch (error) {
            return;
        }
        items.forEach(function (name) {
            var fullPath = path.join(dir, name);
            var stat;
            try {
                stat = fs.statSync(fullPath);
            } catch (error) {
                return;
            }
            if (stat.isDirectory()) {
                walk(fullPath);
            } else if (stat.isFile() && fullPath.endsWith('.json')) {
                var uuid = path.basename(fullPath, '.json');
                if (existing[uuid] || projectUuids[uuid]) {
                    return;
                }
                try {
                    var importJson = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
                    if (importJson.__type__ !== 'cc.SpriteFrame' || !importJson.content) {
                        return;
                    }
                    var textureUuid = importJson.content.texture;
                    if (!internalTextureUuids[textureUuid]) {
                        return;
                    }
                    var textureEntry = entries.filter(function (e) {
                        return e.uuid === textureUuid;
                    })[0];
                    entries.push({
                        name: importJson.content.name || internalTextureUuids[textureUuid],
                        uuid: uuid,
                        sourcePath: textureEntry ? textureEntry.sourcePath : ('library/imports/' + uuid),
                        kind: 'sprite-frame',
                        category: textureEntry ? textureEntry.category : 'image',
                    });
                    existing[uuid] = true;
                } catch (error) {
                    // ignore broken import json
                }
            }
        });
    }

    walk(importsDir);
}

module.exports = {
    scanFromLibrary: scanFromLibrary,
    isInternalRelativePath: isInternalRelativePath,
};
