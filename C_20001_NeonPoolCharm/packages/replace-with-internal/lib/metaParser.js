'use strict';

var path = require('path');
var uuidUtils = require('./uuidUtils');

function basenameWithoutExt(filePath) {
    return path.basename(filePath, path.extname(filePath));
}

function normalizeKind(kind, metaJson) {
    if (metaJson && metaJson.importer === 'folder') {
        return 'folder';
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

function collectMetaEntries(metaJson, sourcePath, entries) {
    if (!metaJson || typeof metaJson !== 'object') {
        return;
    }

    if (metaJson.importer === 'folder') {
        return;
    }

    if (uuidUtils.isUuid(metaJson.uuid)) {
        entries.push({
            name: basenameWithoutExt(sourcePath),
            uuid: uuidUtils.normalizeUuid(metaJson.uuid),
            sourcePath: sourcePath,
            kind: normalizeKind('texture', metaJson),
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
            });
            if (uuidUtils.isUuid(sub.rawTextureUuid)) {
                entries.push({
                    name: key,
                    uuid: uuidUtils.normalizeUuid(sub.rawTextureUuid),
                    sourcePath: sourcePath + '#' + key + '@texture',
                    kind: normalizeKind('texture', sub),
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
    normalizeKind: normalizeKind,
};
