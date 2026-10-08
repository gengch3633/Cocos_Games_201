'use strict';

var path = require('path');
var uuidUtils = require('./uuidUtils');
var categoryUtils = require('./categoryUtils');

function basenameWithoutExt(filePath) {
    return path.basename(filePath, path.extname(filePath));
}

function assetNameFromMetaPath(metaPath) {
    var assetPath = metaPath.replace(/\.meta$/i, '');
    return path.basename(assetPath, path.extname(assetPath));
}

function normalizeKind(kind, metaJson) {
    if (metaJson && metaJson.importer === 'folder') {
        return 'folder';
    }
    if (metaJson && metaJson.importer === 'effect') {
        return 'cc.EffectAsset';
    }
    if (metaJson && metaJson.importer === 'material') {
        return 'cc.Material';
    }
    if (metaJson && metaJson.importer === 'prefab') {
        return 'cc.Prefab';
    }
    if (metaJson && metaJson.importer === 'animation-clip') {
        return 'cc.AnimationClip';
    }
    if (metaJson && metaJson.importer === 'mesh') {
        return 'cc.Mesh';
    }
    if (kind === 'subMeta' || kind === 'cc.SpriteFrame' || kind === 'sprite-frame') {
        return 'sprite-frame';
    }
    if (kind === 'asset' || kind === 'cc.Texture2D' || kind === 'texture') {
        return 'texture';
    }
    if (kind === 'rawTexture') {
        return 'texture';
    }
    return kind || 'unknown';
}

function collectMetaEntries(metaJson, sourcePath, entries, options) {
    options = options || {};
    var category = options.category || categoryUtils.getCategoryFromPath(sourcePath);

    if (!metaJson || typeof metaJson !== 'object') {
        return;
    }

    if (metaJson.importer === 'folder') {
        return;
    }

    if (uuidUtils.isUuid(metaJson.uuid)) {
        entries.push({
            name: assetNameFromMetaPath(sourcePath),
            uuid: uuidUtils.normalizeUuid(metaJson.uuid),
            sourcePath: sourcePath,
            kind: normalizeKind('texture', metaJson),
            category: category,
        });
    }

    if (metaJson.subMetas && typeof metaJson.subMetas === 'object') {
        for (var key in metaJson.subMetas) {
            if (!metaJson.subMetas.hasOwnProperty(key)) {
                continue;
            }
            var sub = metaJson.subMetas[key];
            if (!sub || !uuidUtils.isUuid(sub.uuid)) {
                continue;
            }
            entries.push({
                name: key,
                uuid: uuidUtils.normalizeUuid(sub.uuid),
                sourcePath: sourcePath + '#' + key,
                kind: normalizeKind('sprite-frame', sub),
                category: category,
            });
            if (uuidUtils.isUuid(sub.rawTextureUuid)) {
                entries.push({
                    name: key,
                    uuid: uuidUtils.normalizeUuid(sub.rawTextureUuid),
                    sourcePath: sourcePath + '#' + key + '@texture',
                    kind: normalizeKind('texture', sub),
                    category: category,
                });
            }
        }
    }
}

function indexEntries(entries) {
    var byName = {};
    entries.forEach(function (entry) {
        if (!byName[entry.name]) {
            byName[entry.name] = [];
        }
        byName[entry.name].push(entry);
    });
    return byName;
}

module.exports = {
    collectMetaEntries: collectMetaEntries,
    indexEntries: indexEntries,
    basenameWithoutExt: basenameWithoutExt,
    assetNameFromMetaPath: assetNameFromMetaPath,
    normalizeKind: normalizeKind,
};
