'use strict';

var fs = require('fs');
var path = require('path');

var projectRoot = path.join(__dirname, '..', '..', '..');
var EFFECT_UUID = '494b9b7b-b3da-42e3-9ab2-77ba49ca4a38';
var INTERNAL_EFFECT_UUID = 'abc2cb62-7852-4525-a90d-d474487b88f2';

function getAssetType(uuid) {
    var importPath = path.join(
        projectRoot,
        'library',
        'imports',
        uuid.slice(0, 2),
        uuid + '.json'
    );
    if (!fs.existsSync(importPath)) {
        return 'missing';
    }
    return JSON.parse(fs.readFileSync(importPath, 'utf-8')).__type__ || 'unknown';
}

function walkFiles(dir, filterFn, list) {
    if (!fs.existsSync(dir)) {
        return;
    }
    fs.readdirSync(dir).forEach(function (name) {
        var fullPath = path.join(dir, name);
        var stat;
        try {
            stat = fs.statSync(fullPath);
        } catch (error) {
            return;
        }
        if (stat.isDirectory()) {
            walkFiles(fullPath, filterFn, list);
        } else if (filterFn(fullPath)) {
            list.push(fullPath);
        }
    });
}

function repairMaterialJson(material, effectUuid) {
    if (material.__type__ !== 'cc.Material' || !material._effectAsset) {
        return false;
    }
    var currentUuid = material._effectAsset.__uuid__;
    if (!currentUuid) {
        return false;
    }
    var assetType = getAssetType(currentUuid);
    if (assetType === 'cc.EffectAsset') {
        return false;
    }
    material._effectAsset.__uuid__ = effectUuid;
    return true;
}

function repairMtlFile(filePath, effectUuid) {
    var material = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (!repairMaterialJson(material, effectUuid)) {
        return false;
    }
    fs.writeFileSync(filePath, JSON.stringify(material, null, 2), 'utf-8');
    return true;
}

function repairLibraryMaterial(filePath, effectUuid) {
    var material = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (material.__type__ !== 'cc.Material') {
        return false;
    }
    if (!repairMaterialJson(material, effectUuid)) {
        return false;
    }
    fs.writeFileSync(filePath, JSON.stringify(material, null, 2), 'utf-8');
    return true;
}

function auditAll() {
    var issues = [];
    var mtlFiles = [];
    var libraryFiles = [];

    walkFiles(path.join(projectRoot, 'assets'), function (p) {
        return p.endsWith('.mtl');
    }, mtlFiles);

    walkFiles(path.join(projectRoot, 'library', 'imports'), function (p) {
        return p.endsWith('.json');
    }, libraryFiles);

    function checkMaterial(filePath, material) {
        if (material.__type__ !== 'cc.Material' || !material._effectAsset) {
            return;
        }
        var uuid = material._effectAsset.__uuid__;
        if (!uuid) {
            return;
        }
        var type = getAssetType(uuid);
        if (type !== 'cc.EffectAsset') {
            issues.push({
                file: path.relative(projectRoot, filePath),
                name: material._name,
                uuid: uuid,
                type: type,
            });
        }
    }

    mtlFiles.forEach(function (filePath) {
        try {
            checkMaterial(filePath, JSON.parse(fs.readFileSync(filePath, 'utf-8')));
        } catch (error) {
            issues.push({ file: path.relative(projectRoot, filePath), error: 'invalid json' });
        }
    });

    libraryFiles.forEach(function (filePath) {
        try {
            var json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            if (json.__type__ === 'cc.Material') {
                checkMaterial(filePath, json);
            }
        } catch (error) {
            // ignore non-material json
        }
    });

    return issues;
}

function main() {
    var mode = process.argv[2] || 'repair';
    var effectUuid = EFFECT_UUID;

    if (mode === 'audit') {
        var issues = auditAll();
        console.log('Audit issues:', issues.length);
        issues.forEach(function (item) {
            console.log(JSON.stringify(item));
        });
        process.exit(issues.length > 0 ? 1 : 0);
        return;
    }

    var fixedMtl = 0;
    var fixedLibrary = 0;
    var mtlFiles = [];
    var libraryFiles = [];

    walkFiles(path.join(projectRoot, 'assets'), function (p) {
        return p.endsWith('.mtl');
    }, mtlFiles);

    walkFiles(path.join(projectRoot, 'library', 'imports'), function (p) {
        return p.endsWith('.json');
    }, libraryFiles);

    mtlFiles.forEach(function (filePath) {
        try {
            if (repairMtlFile(filePath, effectUuid)) {
                fixedMtl++;
                console.log('[fixed-mtl]', path.relative(projectRoot, filePath));
            }
        } catch (error) {
            console.log('[skip-mtl]', path.relative(projectRoot, filePath), error.message);
        }
    });

    libraryFiles.forEach(function (filePath) {
        try {
            if (repairLibraryMaterial(filePath, effectUuid)) {
                fixedLibrary++;
                console.log('[fixed-library]', path.relative(projectRoot, filePath));
            }
        } catch (error) {
            // ignore
        }
    });

    console.log('Done. fixed mtl:', fixedMtl, 'fixed library:', fixedLibrary);

    var remaining = auditAll();
    console.log('Remaining issues:', remaining.length);
    if (remaining.length > 0) {
        remaining.slice(0, 10).forEach(function (item) {
            console.log('  ', JSON.stringify(item));
        });
    }
}

main();
