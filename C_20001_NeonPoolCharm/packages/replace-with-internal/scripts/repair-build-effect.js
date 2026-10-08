'use strict';

var fs = require('fs');
var path = require('path');
var uuidUtils = require('../lib/uuidUtils');

var buildRoot = path.join(__dirname, '..', '..', '..', 'build', 'web-mobile');

// internal bundle builtin-phong (abc2cb62-7852-4525-a90d-d474487b88f2)
var INTERNAL_PHONG = '6dkeWRTOBGXICfYQ7JUBnG';
// resources bundle embedded phong (same internal effect)
var RESOURCES_PHONG = 'abwstieFJFJakN1HRIe4jy';
// project builtin-phong effect (494b9b7b-b3da-42e3-9ab2-77ba49ca4a38)
var PROJECT_PHONG = uuidUtils.compressUuid('494b9b7b-b3da-42e3-9ab2-77ba49ca4a38');

function walkJson(dir, list) {
    if (!fs.existsSync(dir)) {
        return;
    }
    fs.readdirSync(dir).forEach(function (name) {
        var fullPath = path.join(dir, name);
        var stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkJson(fullPath, list);
        } else if (name.endsWith('.json')) {
            list.push(fullPath);
        }
    });
}

function getAllBundleTypes() {
    var assetsDir = path.join(buildRoot, 'assets');
    var typeMap = {};
    if (!fs.existsSync(assetsDir)) {
        return typeMap;
    }
    fs.readdirSync(assetsDir).forEach(function (bundle) {
        var bundleDir = path.join(assetsDir, bundle);
        if (!fs.statSync(bundleDir).isDirectory()) {
            return;
        }
        var configFile = fs.readdirSync(bundleDir).find(function (n) {
            return n.startsWith('config.') && n.endsWith('.json');
        });
        if (!configFile) {
            return;
        }
        var config = JSON.parse(fs.readFileSync(path.join(bundleDir, configFile), 'utf-8'));
        Object.keys(config.paths || {}).forEach(function (key) {
            var entry = config.paths[key];
            var uuid = config.uuids[parseInt(key, 10)];
            if (uuid && entry) {
                typeMap[uuid] = config.types[entry[1]];
            }
        });
    });
    return typeMap;
}

function isEffectUuid(uuid, typeMap) {
    if (typeMap[uuid] === 'cc.EffectAsset') {
        return true;
    }
    if (uuid === INTERNAL_PHONG || uuid === RESOURCES_PHONG || uuid === PROJECT_PHONG) {
        return true;
    }
    return false;
}

function repairSerializedMaterial(json, typeMap) {
    if (!Array.isArray(json) || json.length < 3) {
        return false;
    }
    if (!Array.isArray(json[1]) || !Array.isArray(json[2])) {
        return false;
    }
    var fieldNames = json[2];
    var effectIdx = fieldNames.indexOf('_effectAsset');
    if (effectIdx < 0) {
        return false;
    }
    var uuidList = json[1];
    if (uuidList.length <= effectIdx) {
        return false;
    }
    var current = uuidList[effectIdx];
    if (isEffectUuid(current, typeMap)) {
        return false;
    }
    // Prefer internal phong; always available when internal bundle loads first.
    uuidList[effectIdx] = INTERNAL_PHONG;
    return true;
}

function main() {
    if (!fs.existsSync(buildRoot)) {
        console.log('Build not found:', buildRoot);
        process.exit(1);
    }

    var typeMap = getAllBundleTypes();
    var jsonFiles = [];
    walkJson(path.join(buildRoot, 'assets'), jsonFiles);

    var fixed = 0;
    jsonFiles.forEach(function (filePath) {
        var content = fs.readFileSync(filePath, 'utf-8');
        if (content.indexOf('_effectAsset') < 0) {
            return;
        }
        var json;
        try {
            json = JSON.parse(content);
        } catch (error) {
            return;
        }
        if (!repairSerializedMaterial(json, typeMap)) {
            return;
        }
        fs.writeFileSync(filePath, JSON.stringify(json), 'utf-8');
        fixed++;
        console.log('[fixed]', path.relative(buildRoot, filePath));
    });

    console.log('Done. fixed build materials:', fixed);
}

main();
