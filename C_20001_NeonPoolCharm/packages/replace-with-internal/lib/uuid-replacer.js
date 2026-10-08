'use strict';

const Fs = require('fire-fs');
const Path = require('fire-path');

const SCAN_EXTENSIONS = new Set([
    '.prefab',
    '.fire',
    '.mtl',
    '.anim',
    '.meta',
    '.json',
    '.plist',
    '.fnt',
    '.tmx',
    '.tsx',
    '.atlas',
    '.pac',
]);

const SKIP_DIRS = new Set([
    'library',
    'local',
    'temp',
    'build',
    'node_modules',
    '.git',
    '.vscode',
]);

function promisify(fn, ...args) {
    return new Promise((resolve, reject) => {
        fn(...args, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function queryAssets(pattern, assetTypes) {
    return promisify(Editor.assetdb.queryAssets.bind(Editor.assetdb), pattern, assetTypes || null);
}

function deepQueryAssets() {
    return promisify(Editor.assetdb.deepQuery.bind(Editor.assetdb));
}

function normalizeName(value) {
    return String(value || '').trim().toLowerCase();
}

function getUrlBaseName(url) {
    const cleanUrl = String(url || '').split('?')[0].split('#')[0];
    const fileName = Path.basename(cleanUrl);
    const dotIndex = fileName.lastIndexOf('.');
    return dotIndex >= 0 ? fileName.slice(0, dotIndex) : fileName;
}

function getUrlRelativePath(url, mount) {
    const prefix = `db://${mount}/`;
    if (!url || url.indexOf(prefix) !== 0) {
        return '';
    }
    const relative = url.slice(prefix.length);
    const withoutExt = relative.replace(/\.[^./\\]+$/, '');
    return normalizeName(withoutExt.replace(/\\/g, '/'));
}

function flattenDeepQuery(nodes, mountPrefix, output) {
    if (!Array.isArray(nodes)) {
        return;
    }
    nodes.forEach((node) => {
        if (!node || !node.uuid) {
            return;
        }
        const url = Editor.assetdb.uuidToUrl(node.uuid);
        if (!url || url.indexOf(mountPrefix) !== 0) {
            if (Array.isArray(node.children)) {
                flattenDeepQuery(node.children, mountPrefix, output);
            }
            return;
        }
        output.push({
            uuid: node.uuid,
            url,
            type: node.type || '',
            name: node.name || getUrlBaseName(url),
            isSubAsset: !!node.isSubAsset,
            relativePath: getUrlRelativePath(url, mountPrefix.replace('db://', '').replace('/', '')),
        });
        if (Array.isArray(node.children)) {
            flattenDeepQuery(node.children, mountPrefix, output);
        }
    });
}

async function collectAssetsByMount(mount) {
    const mountPrefix = `db://${mount}/`;
    const results = [];

    try {
        const tree = await deepQueryAssets();
        flattenDeepQuery(tree, mountPrefix, results);
    } catch (err) {
        Editor.warn('[replace-with-internal] deepQuery failed, fallback to queryAssets:', err);
        const queried = await queryAssets(`${mountPrefix}**/*`, null);
        queried.forEach((item) => {
            results.push({
                uuid: item.uuid,
                url: item.url,
                type: item.type || '',
                name: getUrlBaseName(item.url),
                isSubAsset: !!item.isSubAsset,
                relativePath: getUrlRelativePath(item.url, mount),
            });
        });
    }

    return results;
}

function buildInternalLookup(internalAssets, matchMode) {
    const byName = new Map();
    const byRelativePath = new Map();

    internalAssets.forEach((asset) => {
        const nameKey = normalizeName(asset.name);
        const pathKey = normalizeName(asset.relativePath);
        if (nameKey && !byName.has(nameKey)) {
            byName.set(nameKey, asset);
        }
        if (pathKey && !byRelativePath.has(pathKey)) {
            byRelativePath.set(pathKey, asset);
        }
    });

    return { byName, byRelativePath, matchMode };
}

function resolveInternalAsset(projectAsset, lookup) {
    const nameKey = normalizeName(projectAsset.name);
    const pathKey = normalizeName(projectAsset.relativePath);

    if (lookup.matchMode === 'relativePath') {
        return lookup.byRelativePath.get(pathKey) || lookup.byName.get(nameKey) || null;
    }
    return lookup.byName.get(nameKey) || lookup.byRelativePath.get(pathKey) || null;
}

function buildUuidReplacementMap(projectAssets, internalAssets, options) {
    const lookup = buildInternalLookup(internalAssets, options.matchMode || 'name');
    const pairs = [];
    const uuidMap = new Map();
    const skippedSameUuid = [];
    const skippedNoMatch = [];

    projectAssets.forEach((projectAsset) => {
        const internalAsset = resolveInternalAsset(projectAsset, lookup);
        if (!internalAsset) {
            skippedNoMatch.push(projectAsset);
            return;
        }
        if (internalAsset.uuid === projectAsset.uuid) {
            skippedSameUuid.push(projectAsset);
            return;
        }
        if (uuidMap.has(projectAsset.uuid)) {
            return;
        }
        uuidMap.set(projectAsset.uuid, internalAsset.uuid);
        pairs.push({
            name: projectAsset.name,
            type: projectAsset.type,
            projectUuid: projectAsset.uuid,
            internalUuid: internalAsset.uuid,
            projectUrl: projectAsset.url,
            internalUrl: internalAsset.url,
        });
    });

    return {
        pairs,
        uuidMap,
        skippedSameUuid,
        skippedNoMatch,
    };
}

function shouldScanFile(filePath) {
    return SCAN_EXTENSIONS.has(Path.extname(filePath).toLowerCase());
}

function walkFiles(rootDir, visitor) {
    if (!Fs.existsSync(rootDir)) {
        return;
    }
    const stack = [rootDir];
    while (stack.length > 0) {
        const current = stack.pop();
        const stat = Fs.statSync(current);
        if (stat.isDirectory()) {
            const dirName = Path.basename(current);
            if (SKIP_DIRS.has(dirName)) {
                continue;
            }
            Fs.readdirSync(current).forEach((entry) => {
                stack.push(Path.join(current, entry));
            });
            continue;
        }
        if (shouldScanFile(current)) {
            visitor(current);
        }
    }
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getCompressedUuid(uuid) {
    if (!uuid || !Editor.Utils || !Editor.Utils.UuidUtils) {
        return '';
    }
    try {
        return Editor.Utils.UuidUtils.compressUuid(uuid, false);
    } catch (err) {
        return '';
    }
}

function buildReplacementPatterns(fromUuid, toUuid) {
    const patterns = [{ from: fromUuid, to: toUuid }];
    const fromCompressed = getCompressedUuid(fromUuid);
    const toCompressed = getCompressedUuid(toUuid);
    if (fromCompressed && toCompressed && fromCompressed !== fromUuid) {
        patterns.push({ from: fromCompressed, to: toCompressed });
    }
    return patterns;
}

function isOwnMetaUuidLine(content, projectUuid) {
    const ownMetaPattern = new RegExp(`"uuid"\\s*:\\s*"${escapeRegExp(projectUuid)}"`);
    return ownMetaPattern.test(content);
}

function replaceUuidReferencesInFile(filePath, uuidMap) {
    if (!Fs.existsSync(filePath)) {
        return [];
    }

    const original = Fs.readFileSync(filePath, 'utf8');
    let content = original;
    const fileReplacements = [];

    uuidMap.forEach((toUuid, fromUuid) => {
        if (Path.extname(filePath).toLowerCase() === '.meta' && isOwnMetaUuidLine(content, fromUuid)) {
            return;
        }
        buildReplacementPatterns(fromUuid, toUuid).forEach(({ from, to }) => {
            const pattern = new RegExp(escapeRegExp(from), 'g');
            const count = (content.match(pattern) || []).length;
            if (count > 0) {
                content = content.replace(pattern, to);
                fileReplacements.push({
                    filePath,
                    fromUuid: from,
                    toUuid: to,
                    count,
                });
            }
        });
    });

    if (content !== original) {
        Fs.writeFileSync(filePath, content, 'utf8');
    }

    return fileReplacements;
}

function getAssetsRoot() {
    return Path.join(Editor.Project.path, 'assets');
}

async function scanReplacementPlan(options) {
    const [internalAssets, projectAssets] = await Promise.all([
        collectAssetsByMount('internal'),
        collectAssetsByMount('assets'),
    ]);

    const plan = buildUuidReplacementMap(projectAssets, internalAssets, options);
    plan.internalCount = internalAssets.length;
    plan.projectCount = projectAssets.length;
    return plan;
}

async function applyReplacementPlan(plan, options) {
    const assetsRoot = getAssetsRoot();
    const touchedFiles = new Set();
    const replacements = [];

    walkFiles(assetsRoot, (filePath) => {
        const fileChanges = replaceUuidReferencesInFile(filePath, plan.uuidMap);
        if (fileChanges.length > 0) {
            touchedFiles.add(filePath);
            replacements.push.apply(replacements, fileChanges);
        }
    });

    if (options.refreshAssetDb !== false) {
        await promisify(Editor.assetdb.refresh.bind(Editor.assetdb), 'db://assets/');
    }

    return {
        touchedFileCount: touchedFiles.size,
        replacementCount: replacements.length,
        replacements,
    };
}

module.exports = {
    SCAN_EXTENSIONS,
    collectAssetsByMount,
    scanReplacementPlan,
    applyReplacementPlan,
    buildUuidReplacementMap,
};
