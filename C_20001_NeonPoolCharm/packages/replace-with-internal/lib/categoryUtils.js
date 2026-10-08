'use strict';

var INTERNAL_CATEGORIES = [
    'effects',
    'image',
    'materials',
    'misc',
    'model',
    'obsolete',
    'particle',
    'prefab',
    'resources',
];

var CATEGORY_LABELS = {
    effects: 'effects (特效)',
    image: 'image (图片)',
    materials: 'materials (材质)',
    misc: 'misc (杂项)',
    model: 'model (模型)',
    obsolete: 'obsolete (废弃)',
    particle: 'particle (粒子)',
    prefab: 'prefab (预制体)',
    resources: 'resources (资源)',
    other: 'other (其他)',
};

var KIND_LABELS = {
    'texture': 'Texture',
    'sprite-frame': 'SpriteFrame',
    'cc.Material': 'Material',
    'cc.EffectAsset': 'Effect',
    'cc.Prefab': 'Prefab',
    'cc.AnimationClip': 'AnimationClip',
    'cc.Mesh': 'Mesh',
    'unknown': 'Asset',
};

function getCategoryFromPath(sourcePath) {
    if (!sourcePath) {
        return 'other';
    }

    var normalized = sourcePath.replace(/\\/g, '/');
    var parts = normalized.split('/').filter(function (p) {
        return p && p.length > 0;
    });

    for (var i = 0; i < parts.length; i++) {
        if (INTERNAL_CATEGORIES.indexOf(parts[i]) >= 0) {
            return parts[i];
        }
    }

    if (parts.indexOf('resources') >= 0) {
        var idx = parts.indexOf('resources');
        if (parts[idx + 1] === 'effects') {
            return 'effects';
        }
        if (parts[idx + 1] === 'materials') {
            return 'materials';
        }
        return 'resources';
    }

    return 'other';
}

function getKindLabel(kind) {
    return KIND_LABELS[kind] || kind || 'Asset';
}

function getCategoryLabel(category) {
    return CATEGORY_LABELS[category] || category;
}

function groupPairsByCategory(pairs) {
    var grouped = {};
    var order = INTERNAL_CATEGORIES.concat(['other']);

    pairs.forEach(function (pair) {
        var category = pair.category || 'other';
        if (!grouped[category]) {
            grouped[category] = [];
        }
        grouped[category].push(pair);
    });

    return order.filter(function (cat) {
        return grouped[cat] && grouped[cat].length > 0;
    }).map(function (cat) {
        return {
            name: cat,
            label: getCategoryLabel(cat),
            pairs: grouped[cat],
        };
    });
}

module.exports = {
    INTERNAL_CATEGORIES: INTERNAL_CATEGORIES,
    CATEGORY_LABELS: CATEGORY_LABELS,
    getCategoryFromPath: getCategoryFromPath,
    getKindLabel: getKindLabel,
    getCategoryLabel: getCategoryLabel,
    groupPairsByCategory: groupPairsByCategory,
};
