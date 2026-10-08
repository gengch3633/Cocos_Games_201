'use strict';

var fs = require('fs');
var path = require('path');
var uuidUtils = require('./uuidUtils');

var REFERENCE_FILE_SUFFIXES = [
    '.prefab',
    '.fire',
    '.anim',
];

function isReferenceFile(filePath) {
    for (var i = 0; i < REFERENCE_FILE_SUFFIXES.length; i++) {
        var suffix = REFERENCE_FILE_SUFFIXES[i];
        if (filePath.length >= suffix.length &&
            filePath.slice(filePath.length - suffix.length) === suffix) {
            return true;
        }
    }
    return false;
}

function buildReplacementLookup(uuidMap) {
    var lookup = {};

    Object.keys(uuidMap).forEach(function (fromUuid) {
        var toUuid = uuidMap[fromUuid];
        lookup[fromUuid] = toUuid;
        lookup[fromUuid.replace(/-/g, '')] = toUuid;
        lookup[uuidUtils.compressUuid(fromUuid, false)] = toUuid;
        lookup[uuidUtils.compressUuid(fromUuid, true)] = toUuid;
    });

    return lookup;
}

function replaceUuidValue(value, lookup) {
    if (!uuidUtils.isUuid(value)) {
        return value;
    }

    var normalized = uuidUtils.normalizeUuid(value);
    if (lookup[normalized]) {
        if (value.indexOf('-') >= 0 && value.length === 36) {
            return lookup[normalized];
        }
        return uuidUtils.compressUuid(lookup[normalized], value.length <= 23);
    }

    if (lookup[value]) {
        return lookup[value];
    }

    return value;
}

function replaceReferencesInJsonNode(node, lookup) {
    if (!node || typeof node !== 'object') {
        return;
    }

    if (Array.isArray(node)) {
        for (var i = 0; i < node.length; i++) {
            replaceReferencesInJsonNode(node[i], lookup);
        }
        return;
    }

    if (uuidUtils.isUuid(node.__uuid__)) {
        node.__uuid__ = replaceUuidValue(node.__uuid__, lookup);
    }

    for (var key in node) {
        if (!node.hasOwnProperty(key)) {
            continue;
        }
        var child = node[key];
        if (child && typeof child === 'object') {
            replaceReferencesInJsonNode(child, lookup);
        }
    }
}

function replaceReferencesInFile(filePath, lookup) {
    var content = fs.readFileSync(filePath, 'utf-8');
    var parsed;

    try {
        parsed = JSON.parse(content);
    } catch (error) {
        return false;
    }

    var before = JSON.stringify(parsed);
    replaceReferencesInJsonNode(parsed, lookup);
    var after = JSON.stringify(parsed);

    if (before !== after) {
        fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), 'utf-8');
        return true;
    }
    return false;
}

function replaceReferencesInDirectory(rootDir, uuidMap) {
    var lookup = buildReplacementLookup(uuidMap);
    var changedFiles = [];

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
            } else if (stat.isFile() && isReferenceFile(fullPath)) {
                if (replaceReferencesInFile(fullPath, lookup)) {
                    changedFiles.push(fullPath);
                }
            }
        });
    }

    walk(rootDir);
    return changedFiles;
}

module.exports = {
    REFERENCE_FILE_SUFFIXES: REFERENCE_FILE_SUFFIXES,
    buildReplacementLookup: buildReplacementLookup,
    replaceReferencesInDirectory: replaceReferencesInDirectory,
    replaceReferencesInFile: replaceReferencesInFile,
    replaceReferencesInJsonNode: replaceReferencesInJsonNode,
    isReferenceFile: isReferenceFile,
};
