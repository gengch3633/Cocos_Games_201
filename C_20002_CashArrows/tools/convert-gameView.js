const fs = require("fs");
const path = require("path");

const input = path.join(__dirname, "../assets/scripts/third/gameView.js");
const output = path.join(__dirname, "../assets/scripts/third/gameView.ts");

let src = fs.readFileSync(input, "utf8");

// Strip webpack/cc._RF boilerplate
src = src.replace(/^let e = require;\s*\nlet t = module;\s*\nlet i = exports;\s*\n"use strict";\s*\ncc\._RF\.push\([^)]+\);\s*\n/, "");
src = src.replace(/var n = __extends,\s*\na = __decorate;\s*\n__awaiter,\s*\n__generator;\s*\nObject\.defineProperty\(i, "__esModule", \{[\s\S]*?\}\);\s*\n/, "");
src = src.replace(/cc\._RF\.pop\(\);\s*$/, "");
src = src.replace(/i\.default = \w+;\s*$/, "");

// Parse top-level requires
const requireBlock = src.match(/^var o = e\("[\s\S]*?P = e\("[^"]+"\),\s*\n/);
const aliasMap = {};
if (requireBlock) {
    const re = /(\w+)\s*=\s*(?:\(\s*)?e\("([^"]+)"\)/g;
    let m;
    while ((m = re.exec(requireBlock[0])) !== null) {
        if (m[2] === "MultiPlatform.js") continue;
        let importName = m[2].replace(/\.js$/, "");
        aliasMap[m[1]] = importName;
    }
    src = src.replace(requireBlock[0], "");
}

// Add inline requires to aliasMap
const inlineModules = [
    ["PlayerDataStore.js", "PlayerDataStore"],
    ["LoadingHttpService.js", "LoadingHttpService"],
    ["Handler.js", "Handler"],
    ["arrowSettleRewardView", "arrowSettleRewardView"],
    ["arrowTaskPopupView", "arrowTaskPopupView"],
];
for (const [mod, name] of inlineModules) {
    aliasMap["__" + name] = name;
}

// Remove inline require statements
src = src.replace(/\s*var i = e\("PlayerDataStore\.js"\),\s*\n\s*n = i\.default \|\| i;\s*\n/g, "");
src = src.replace(/\s*var o = e\("LoadingHttpService\.js"\),\s*\n\s*r = e\("Handler\.js"\),\s*\n/g, "");
src = src.replace(/\s*var t = e\("arrowSettleRewardView"\),\s*\n/g, "");
src = src.replace(/\s*var n = e\("arrowTaskPopupView"\), a = n\.default\|\| n, o = i\.getComponent\(a\);\s*\n/g, "        const ArrowTaskPopupView = require(\"arrowTaskPopupView\").default || require(\"arrowTaskPopupView\");\n        const o = i.getComponent(ArrowTaskPopupView);\n");

// cc._decorator
src = src.replace(/var E = cc\._decorator,\s*\nM = E\.ccclass,\s*\nL = E\.property,\s*\nD = E\.menu,\s*\n/, "");

// Replace alias.default with ImportName
for (const [alias, importName] of Object.entries(aliasMap)) {
    const re = new RegExp(`\\b${alias}\\.default\\b`, "g");
    src = src.replace(re, importName);
}

// Replace bare alias for module calls (careful order - longer aliases first)
const sortedAliases = Object.entries(aliasMap).sort((a, b) => b[0].length - a[0].length);
for (const [alias, importName] of sortedAliases) {
    // Replace alias. with ImportName. for method calls
    const re = new RegExp(`\\b${alias}\\.`, "g");
    src = src.replace(re, `${importName}.`);
}

// Special: S is game module - ClickState, Direction
src = src.replace(/\bS\.ClickState\b/g, "ClickState");
src = src.replace(/\bS\.Direction\b/g, "Direction");

// Convert IIFE class to export default class
src = src.replace(
    /x = function\(t\) \{\s*function i\(\) \{\s*var e = null !== t&& t\.apply\(this, arguments\)\|\| this;/,
    `export default class GameView extends cc.Component {
    constructor() {
        super();`
);

// Remove extends boilerplate
src = src.replace(/\s*a\(i, t\);\s*\n/g, "\n");

// Convert prototype methods to class methods
src = src.replace(/;\s*\n\s*i\.prototype\.(\w+) = function/g, ";\n\n    $1(");
src = src.replace(/i\.prototype\.(\w+) = function/g, "$1(");

// Convert property decorators
src = src.replace(/a\(\[L\], i\.prototype, "(\w+)", void 0\);/g, "@property\n    $1 = undefined as any;");
src = src.replace(/a\(\[L\(cc\.Node\)\], i\.prototype, "(\w+)", void 0\);/g, "@property(cc.Node)\n    $1: cc.Node | null = null;");
src = src.replace(/a\(\[L\(cc\.Sprite\)\], i\.prototype, "(\w+)", void 0\);/g, "@property(cc.Sprite)\n    $1: cc.Sprite | null = null;");
src = src.replace(/a\(\[L\(cc\.Label\)\], i\.prototype, "(\w+)", void 0\);/g, "@property(cc.Label)\n    $1: cc.Label | null = null;");
src = src.replace(/a\(\[L\(cc\.Slider\)\], i\.prototype, "(\w+)", void 0\);/g, "@property(cc.Slider)\n    $1: cc.Slider | null = null;");
src = src.replace(/a\(\[L\(cc\.RichText\)\], i\.prototype, "(\w+)", void 0\);/g, "@property(cc.RichText)\n    $1: cc.RichText | null = null;");

// Class decorator
src = src.replace(/return a\(\[M, D\("业务逻辑\/gameView"\)\], i\);\s*\}\s*\(cc\.Component\);/, "@ccclass\n@menu(\"业务逻辑/gameView\")\n}");

// Fix constructor field assignments - remove trailing semicolons style
src = src.replace(/e\.(\w+) = null;/g, "this.$1 = null;");
src = src.replace(/e\.(\w+) = ! ([01])/g, "this.$1 = !$2");
src = src.replace(/e\.(\w+) = (\d+)/g, "this.$1 = $2");
src = src.replace(/e\.(\w+) = \[\]/g, "this.$1 = []");
src = src.replace(/e\.(\w+) = \{\}/g, "this.$1 = {}");
src = src.replace(/e\.(\w+) = ([\.\d]+)/g, "this.$1 = $2");
src = src.replace(/e\.(\w+) = ! 0/g, "this.$1 = true");
src = src.replace(/e\.(\w+) = ! 1/g, "this.$1 = false");
src = src.replace(/return e;\s*\n\s*\}/, "    }\n");

// Build imports
const importNames = [...new Set(Object.values(aliasMap))].sort();
const namedFromGame = ["ClickState"];
const gameImport = 'import Game, { ClickState } from "./game";';
const otherImports = importNames
    .filter(n => n !== "game.js" && n !== "game")
    .map(n => {
        const file = n.replace(/([A-Z])/g, (m, c, i) => (i ? "-" : "") + c.toLowerCase());
        // Use original casing for file path
        const filePath = "./" + n;
        if (n === "InterfaceMgr") return 'import InterfaceMgr, { bundleName, gameEvent } from "./InterfaceMgr";';
        if (n === "ConfigDefine") return 'import ConfigDefine, { GametimeConfig } from "./ConfigDefine";';
        return `import ${n} from "./${n}";`;
    })
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort();

// Fix import paths to match actual file names
const importBlock = [
    'import AdManager from "./AdManager";',
    'import ArrowSettleRewardView from "./arrowSettleRewardView";',
    'import ArrowTaskPopupView from "./arrowTaskPopupView";',
    'import AudioMgr from "./AudioMgr";',
    'import BarrageDataService from "./BarrageDataService";',
    'import BusinessAnalyticsService from "./BusinessAnalyticsService";',
    'import ConfigDefine, { GametimeConfig } from "./ConfigDefine";',
    'import ConfigMgr from "./ConfigMgr";',
    'import CountryAssetService from "./CountryAssetService";',
    'import FlyRewardAnimMgr from "./FlyRewardAnimMgr";',
    'import Game, { ClickState } from "./game";',
    'import GlobalEventMgr from "./GlobalEventMgr";',
    'import Handler from "./Handler";',
    'import InterfaceMgr, { bundleName, gameEvent } from "./InterfaceMgr";',
    'import LanguageService from "./LanguageService";',
    'import LoadingHttpService from "./LoadingHttpService";',
    'import NewbieGuideFlow from "./NewbieGuideFlow";',
    'import NodePoolMgr from "./NodePoolMgr";',
    'import NumberUtils from "./NumberUtils";',
    'import NetErrorPopupService from "./NetErrorPopupService";',
    'import PlayerDataStore from "./PlayerDataStore";',
    'import Random from "./Random";',
    'import ResMgr from "./ResMgr";',
    'import UIDefine from "./UIDefine";',
    'import UIMgr from "./UIMgr";',
    'import UserData from "./UserData";',
    'import UserInfoService from "./UserInfoService";',
    'import WithMoodView from "./withMoodView";',
    '',
    'const { ccclass, property, menu } = cc._decorator;',
    '',
].join("\n");

const result = importBlock + src;
fs.writeFileSync(output, result, "utf8");
console.log("Wrote", output, result.length, "bytes");
