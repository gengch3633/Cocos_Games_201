const fs = require("fs");
const path = require("path");

const input = path.join(__dirname, "../assets/scripts/third/gameView.js");
const output = path.join(__dirname, "../assets/scripts/third/gameView.ts");

let src = fs.readFileSync(input, "utf8");

// --- Strip boilerplate ---
src = src.replace(/^let e = require;\s*\nlet t = module;\s*\nlet i = exports;\s*\n"use strict";\s*\n/, "");
src = src.replace(/cc\._RF\.push\([^)]+\);\s*\n/, "");
src = src.replace(/cc\._RF\.pop\(\);\s*\n?$/, "");
src = src.replace(/var n = __extends,\s*\na = __decorate;\s*\n(?:__awaiter,\s*\n__generator;\s*\n)?/, "");
src = src.replace(/Object\.defineProperty\(i, "__esModule", \{[\s\S]*?\}\);\s*\n/, "");
src = src.replace(/i\.default = \w+;\s*\n?$/, "");

// Remove top require block
src = src.replace(/var o = e\("AudioMgr\.js"\),[\s\S]*?P = e\("NetErrorPopupService\.js"\),\s*\n/, "");
src = src.replace(/var E = cc\._decorator,\s*\nM = E\.ccclass,\s*\nL = E\.property,\s*\nD = E\.menu,\s*\n/, "");

// Remove inline requires
src = src.replace(/\s*var i = e\("PlayerDataStore\.js"\),\s*\n\s*n = i\.default \|\| i;\s*\n/g, "\n");
src = src.replace(/\s*var o = e\("LoadingHttpService\.js"\),\s*\n\s*r = e\("Handler\.js"\),\s*\n/g, "\n");
src = src.replace(/\s*var t = e\("arrowSettleRewardView"\),\s*\n/g, "\n");
src = src.replace(
    /\s*var n = e\("arrowTaskPopupView"\), a = n\.default\|\| n, o = i\.getComponent\(a\);\s*\n/g,
    "\n        const taskPopupComp = i.getComponent(ArrowTaskPopupView);\n        const o = taskPopupComp;\n"
);

// Module alias map (webpack minified -> import name)
const ALIAS = {
    o: "AudioMgr",
    r: "ConfigMgr",
    s: "GlobalEventMgr",
    l: "ResMgr",
    c: "UIMgr",
    u: "NumberUtils",
    d: "Random",
    h: "InterfaceMgr",
    p: "ConfigDefine",
    _: "UserData",
    f: "UIDefine",
    g: "AdManager",
    m: "BusinessAnalyticsService",
    y: "BarrageDataService",
    v: "LanguageService",
    b: "CountryAssetService",
    w: "NewbieGuideFlow",
    k: "WithMoodView",
    S: "Game",
    C: "NodePoolMgr",
    T: "PlayerDataStore",
    N: "LoadingHttpService",
    I: "Handler",
    A: "FlyRewardAnimMgr",
    R: "UserInfoService",
    P: "NetErrorPopupService",
};

// Replace alias.default -> ImportName
for (const [alias, name] of Object.entries(ALIAS)) {
    src = src.replace(new RegExp(`\\b${alias}\\.default\\b`, "g"), name);
}

// Replace alias. -> ImportName. (longer aliases first to avoid partial matches)
const aliases = Object.keys(ALIAS).sort((a, b) => b.length - a.length);
for (const alias of aliases) {
    src = src.replace(new RegExp(`\\b${alias}\\.`, "g"), `${ALIAS[alias]}.`);
}

// Game module named exports
src = src.replace(/\bGame\.ClickState\b/g, "ClickState");
src = src.replace(/\bS\.ClickState\b/g, "ClickState");

// Special patterns
src = src.replace(/\bR&& R\.default\? R\.default: R\b/g, "UserInfoService");
src = src.replace(/\bP\.default\|\| P\b/g, "NetErrorPopupService");
src = src.replace(/\bk\.default\|\| k\b/g, "WithMoodView");
src = src.replace(/\bv\.default\|\| v\b/g, "LanguageService");
src = src.replace(/\bT\.default\b/g, "PlayerDataStore");

// Convert IIFE class
src = src.replace(
    /var x = function\(t\) \{\s*function i\(\) \{\s*var e = null !== t&& t\.apply\(this, arguments\)\|\| this;/,
    "export default class GameView extends cc.Component {\n    "
);

// Remove n(i,t) extends call
src = src.replace(/\s*n\(i, t\);\s*\n/, "\n");

// Convert constructor fields: e.field -> this.field
const ctorMatch = src.match(/export default class GameView extends cc\.Component \{\s*([\s\S]*?)return e;\s*\n\s*\}/);
if (ctorMatch) {
    let fields = ctorMatch[1];
    fields = fields.replace(/\be\.(\w+)\s*=/g, "    $1 =");
    fields = fields.replace(/! 0/g, "true");
    fields = fields.replace(/! 1/g, "false");
    src = src.replace(ctorMatch[0], "export default class GameView extends cc.Component {\n" + fields + "\n");
}

// Convert prototype methods
src = src.replace(/;\s*\n\s*i\.prototype\.(\w+) = function\s*\(([^)]*)\)\s*\{/g, ";\n\n    $1($2): void {");
src = src.replace(/i\.prototype\.(\w+) = function\s*\(([^)]*)\)\s*\{/g, "$1($2): void {");

// Convert property decorators at end
src = src.replace(/a\(\[L\], i\.prototype, "(\w+)", void 0\);/g, "");
src = src.replace(/a\(\[L\(cc\.Node\)\], i\.prototype, "(\w+)", void 0\);/g, "@property(cc.Node)\n    $1: cc.Node | null = null;\n");
src = src.replace(/a\(\[L\(cc\.Sprite\)\], i\.prototype, "(\w+)", void 0\);/g, "@property(cc.Sprite)\n    $1: cc.Sprite | null = null;\n");
src = src.replace(/a\(\[L\(cc\.Label\)\], i\.prototype, "(\w+)", void 0\);/g, "@property(cc.Label)\n    $1: cc.Label | null = null;\n");
src = src.replace(/a\(\[L\(cc\.Slider\)\], i\.prototype, "(\w+)", void 0\);/g, "@property(cc.Slider)\n    $1: cc.Slider | null = null;\n");
src = src.replace(/a\(\[L\(cc\.RichText\)\], i\.prototype, "(\w+)", void 0\);/g, "@property(cc.RichText)\n    $1: cc.RichText | null = null;\n");

// Class decorator
src = src.replace(/return a\(\[M, D\("业务逻辑\/gameView"\)\], i\);\s*\}\s*\(cc\.Component\);/, "");

// Add showTime property manually
if (!src.includes("@property\n    showTime")) {
    src = src.replace(
        /export default class GameView extends cc\.Component \{\s*\n/,
        "export default class GameView extends cc.Component {\n    @property\n    showTime = true;\n\n"
    );
}

// Close class
src = src.trimEnd() + "\n}\n";

const imports = `import AdManager from "./AdManager";
import ArrowSettleRewardView from "./arrowSettleRewardView";
import ArrowTaskPopupView from "./arrowTaskPopupView";
import AudioMgr from "./AudioMgr";
import BarrageDataService from "./BarrageDataService";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import ConfigDefine, { GametimeConfig } from "./ConfigDefine";
import ConfigMgr from "./ConfigMgr";
import CountryAssetService from "./CountryAssetService";
import FlyRewardAnimMgr from "./FlyRewardAnimMgr";
import Game, { ClickState } from "./game";
import GlobalEventMgr from "./GlobalEventMgr";
import Handler from "./Handler";
import InterfaceMgr, { bundleName, gameEvent } from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import LoadingHttpService from "./LoadingHttpService";
import NewbieGuideFlow from "./NewbieGuideFlow";
import NetErrorPopupService from "./NetErrorPopupService";
import NodePoolMgr from "./NodePoolMgr";
import NumberUtils from "./NumberUtils";
import PlayerDataStore from "./PlayerDataStore";
import Random from "./Random";
import ResMgr from "./ResMgr";
import UIDefine from "./UIDefine";
import UIMgr from "./UIMgr";
import UserData from "./UserData";
import UserInfoService from "./UserInfoService";
import WithMoodView from "./withMoodView";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("业务逻辑/gameView")
`;

const result = imports + src.replace(/^export default class GameView extends cc\.Component \{/, "export default class GameView extends cc.Component {");
fs.writeFileSync(output, result, "utf8");

// Stats
const defaults = (result.match(/\.default/g) || []).length;
const prototypes = (result.match(/i\.prototype/g) || []).length;
console.log(`Wrote ${output} (${result.length} bytes)`);
console.log(`Remaining .default: ${defaults}, i.prototype: ${prototypes}`);
