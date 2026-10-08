'use strict';

var fs = require('fs');
var path = require('path');
var uuidUtils = require('../lib/uuidUtils');

var buildRoot = path.join(__dirname, '..', '..', '..', 'build', 'web-mobile');
var projectRoot = path.join(__dirname, '..', '..', '..');

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

function loadBundleTypes(bundleName) {
    var configPath = path.join(buildRoot, 'assets', bundleName, 'config.' + findConfigHash(bundleName) + '.json');
    if (!fs.existsSync(configPath)) {
        var dir = path.join(buildRoot, 'assets', bundleName);
        var configFile = fs.readdirSync(dir).find(function (n) {
            return n.startsWith('config.') && n.endsWith('.json');
        });
        if (!configFile) {
            return { types: {}, uuids: [] };
        }
        configPath = path.join(dir, configFile);
    }
    var config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    var typeMap = {};
    (config.uuids || []).forEach(function (uuid, index) {
        typeMap[uuid] = (config.types || [])[config.paths[String(index)] ? config.paths[String(index)][1] : -1];
        // paths keys might be numeric strings
    });
    // rebuild from paths
    Object.keys(config.paths || {}).forEach(function (key) {
        var entry = config.paths[key];
        var uuid = config.uuids[parseInt(key, 10)];
        if (uuid && entry) {
            typeMap[uuid] = config.types[entry[1]];
        }
    });
    return { types: typeMap, config: config };
}

function findConfigHash(bundleName) {
    var dir = path.join(buildRoot, 'assets', bundleName);
    var configFile = fs.readdirSync(dir).find(function (n) {
        return n.startsWith('config.') && n.endsWith('.json');
    });
    return configFile ? configFile.slice('config.'.length, -'.json'.length) : '';
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

function findEffectRefsInJson(json, refs, filePath) {
    if (typeof json === 'string') {
        return;
    }
    if (Array.isArray(json)) {
        // Cocos serialized format: deps array + "_effectAsset" in field names
        if (json.length >= 3 && Array.isArray(json[1]) && Array.isArray(json[2])) {
            var uuidList = json[1];
            var fieldNames = json[2];
            var effectIdx = fieldNames.indexOf('_effectAsset');
            if (effectIdx >= 0 && uuidList.length > effectIdx) {
                refs.push({ file: filePath, uuid: uuidList[effectIdx] });
            }
        }
        json.forEach(function (item) {
            findEffectRefsInJson(item, refs, filePath);
        });
        return;
    }
    if (json && typeof json === 'object') {
        if (json.__type__ === 'cc.Material' && json._effectAsset && json._effectAsset.__uuid__) {
            refs.push({ file: filePath, uuid: json._effectAsset.__uuid__ });
        }
        Object.keys(json).forEach(function (key) {
            findEffectRefsInJson(json[key], refs, filePath);
        });
    }
}

function main() {
    if (!fs.existsSync(buildRoot)) {
        console.log('Build not found:', buildRoot);
        process.exit(1);
    }

    var typeMap = getAllBundleTypes();
    var jsonFiles = [];
    walkJson(path.join(buildRoot, 'assets'), jsonFiles);

    var issues = [];
    var ok = 0;

    jsonFiles.forEach(function (filePath) {
        var content;
        try {
            content = fs.readFileSync(filePath, 'utf-8');
        } catch (error) {
            return;
        }
        if (content.indexOf('_effectAsset') < 0 && content.indexOf('cc.Material') < 0) {
            return;
        }
        var json;
        try {
            json = JSON.parse(content);
        } catch (error) {
            return;
        }
        var refs = [];
        findEffectRefsInJson(json, refs, path.relative(buildRoot, filePath));
        refs.forEach(function (ref) {
            var compressed = ref.uuid;
            var assetType = typeMap[compressed];
            if (assetType === 'cc.EffectAsset') {
                ok++;
                return;
            }
            var stdUuid = uuidUtils.isUuid(compressed)
                ? compressed
                : uuidUtils.decompressUuid(compressed);
            issues.push({
                file: ref.file,
                uuid: compressed,
                stdUuid: stdUuid,
                type: assetType || 'NOT_IN_BUNDLE',
            });
        });
    });

    console.log('Build:', buildRoot);
    console.log('Valid effect refs:', ok);
    console.log('Issues:', issues.length);
    issues.forEach(function (item) {
        console.log(JSON.stringify(item));
    });
}

main();
