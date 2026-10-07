const fs = require("fs");
const path = require("path");

const input = path.join(__dirname, "../assets/scripts/third/gameView.js");
const output = path.join(__dirname, "../assets/scripts/third/gameView.ts");

let src = fs.readFileSync(input, "utf8");

// Strip cc._RF and module boilerplate
src = src.replace(/^let e = require;\r?\nlet t = module;\r?\nlet i = exports;\r?\n"use strict";\r?\ncc\._RF\.push\([^\)]+\);\r?\n/, "");
src = src.replace(/cc\._RF\.pop\(\);\r?\n?$/, "");
src = src.replace(/var n = __extends,\r?\na = __decorate;\r?\n__awaiter,\r?\n__generator;\r?\n/, "");
src = src.replace(/Object\.defineProperty\(i, "__esModule", \{[\s\S]*?\}\);\r?\n/, "");
src = src.replace(/i\.default = \w+;\r?\n?$/, "");

// Remove require + decorator var block, keep x = function(t)
src = src.replace(/var o = e\("AudioMgr\.js"\),[\s\S]*?D = E\.menu,\r?\n/, "");

// Inline requires
src = src.replace(/\r?\n\s*var i = e\("PlayerDataStore\.js"\),\r?\n\s*n = i\.default \|\| i;\r?\n/g, "\n");
src = src.replace(/\r?\n\s*var o = e\("LoadingHttpService\.js"\),\r?\n\s*r = e\("Handler\.js"\),\r?\n/g, "\n");
src = src.replace(/\r?\n\s*var t = e\("arrowSettleRewardView"\),\r?\n/g, "\n");
src = src.replace(
    /\r?\n\s*var n = e\("arrowTaskPopupView"\), a = n\.default\|\| n, o = i\.getComponent\(a\);\r?\n/g,
    "\n        const o = i.getComponent(ArrowTaskPopupView);\n"
);

const ALIAS = {
    o: "AudioMgr", r: "ConfigMgr", s: "GlobalEventMgr", l: "ResMgr", c: "UIMgr",
    u: "NumberUtils", d: "Random", h: "InterfaceMgr", p: "ConfigDefine", _: "UserData",
    f: "UIDefine", g: "AdManager", m: "BusinessAnalyticsService", y: "BarrageDataService",
    v: "LanguageService", b: "CountryAssetService", w: "NewbieGuideFlow", k: "WithMoodView",
    S: "Game", C: "NodePoolMgr", T: "PlayerDataStore", N: "LoadingHttpService",
    I: "Handler", A: "FlyRewardAnimMgr", R: "UserInfoService", P: "NetErrorPopupService",
};

for (const [alias, name] of Object.entries(ALIAS)) {
    src = src.replace(new RegExp(`\\b${alias}\\.default\\b`, "g"), name);
}
for (const alias of Object.keys(ALIAS).sort((a, b) => b.length - a.length)) {
    src = src.replace(new RegExp(`\\b${alias}\\.`, "g"), `${ALIAS[alias]}.`);
}
src = src.replace(/\bGame\.ClickState\b/g, "ClickState");
src = src.replace(/\bR&& UserInfoService\? UserInfoService: UserInfoService\b/g, "UserInfoService");
src = src.replace(/\bNetErrorPopupService\|\| NetErrorPopupService\b/g, "NetErrorPopupService");
src = src.replace(/\bWithMoodView\|\| WithMoodView\b/g, "WithMoodView");
src = src.replace(/\bLanguageService\|\| LanguageService\b/g, "LanguageService");
src = src.replace(/\bvar i = e\("PlayerDataStore\.js"\),\r?\n\s*n = Number\(i&& i\.default&& i\.default\.guideline_eliminate_num/g,
    "var n = Number(PlayerDataStore && PlayerDataStore.guideline_eliminate_num");
src = src.replace(/i&& i\.default&& i\.default\.guideline_eliminate_num/g, "PlayerDataStore && PlayerDataStore.guideline_eliminate_num");
src = src.replace(/t&& t\.default\? t\.default: t/g, "ArrowSettleRewardView");

// Extract property decorators before class conversion
const properties = [];
src = src.replace(/a\(\[L\], i\.prototype, "(\w+)", void 0\);\r?\n/g, () => { properties.push({ name: "showTime", type: null }); return ""; });
src = src.replace(/a\(\[L\(cc\.Node\)\], i\.prototype, "(\w+)", void 0\);\r?\n/g, (_, n) => { properties.push({ name: n, type: "cc.Node" }); return ""; });
src = src.replace(/a\(\[L\(cc\.Sprite\)\], i\.prototype, "(\w+)", void 0\);\r?\n/g, (_, n) => { properties.push({ name: n, type: "cc.Sprite" }); return ""; });
src = src.replace(/a\(\[L\(cc\.Label\)\], i\.prototype, "(\w+)", void 0\);\r?\n/g, (_, n) => { properties.push({ name: n, type: "cc.Label" }); return ""; });
src = src.replace(/a\(\[L\(cc\.Slider\)\], i\.prototype, "(\w+)", void 0\);\r?\n/g, (_, n) => { properties.push({ name: n, type: "cc.Slider" }); return ""; });
src = src.replace(/a\(\[L\(cc\.RichText\)\], i\.prototype, "(\w+)", void 0\;\r?\n/g, (_, n) => { properties.push({ name: n, type: "cc.RichText" }); return ""; });

// Convert class IIFE
const classRe = /x = function\(t\) \{\s*function i\(\) \{\s*var e = null !== t&& t\.apply\(this, arguments\)\|\| this;([\s\S]*?)return e;\s*\}\s*n\(i, t\);([\s\S]*?)return a\(\[M, D\("业务逻辑\/gameView"\)\], i\);\s*\}\s*\(cc\.Component\);/;
const classMatch = src.match(classRe);
if (!classMatch) {
    console.error("Failed to match class pattern");
    process.exit(1);
}

let fieldsBlock = classMatch[1];
let methodsBlock = classMatch[2];

// Convert fields
fieldsBlock = fieldsBlock.replace(/\be\.(\w+)\s*=\s*null;/g, "    $1: any = null;");
fieldsBlock = fieldsBlock.replace(/\be\.(\w+)\s*=\s*!\s*0;/g, "    $1 = true;");
fieldsBlock = fieldsBlock.replace(/\be\.(\w+)\s*=\s*!\s*1;/g, "    $1 = false;");
fieldsBlock = fieldsBlock.replace(/\be\.(\w+)\s*=\s*(\d+(?:\.\d+)?);/g, "    $1 = $2;");
fieldsBlock = fieldsBlock.replace(/\be\.(\w+)\s*=\s*\[\];/g, "    $1: any[] = [];");
fieldsBlock = fieldsBlock.replace(/\be\.(\w+)\s*=\s*"([^"]*)";/g, '    $1 = "$2";');
fieldsBlock = fieldsBlock.replace(/\be\.(\w+)\s*=\s*(\{[\s\S]*?\});/g, "    $1 = $2;");

// Convert methods
methodsBlock = methodsBlock.replace(/;\s*\r?\n\s*i\.prototype\.(\w+) = function\s*\(([^)]*)\)\s*\{/g, ";\n\n    $1($2): any {");
methodsBlock = methodsBlock.replace(/i\.prototype\.(\w+) = function\s*\(([^)]*)\)\s*\{/g, "$1($2): any {");

// Build property declarations from extracted + fields that overlap
let propDecls = "    @property\n    showTime = true;\n\n";

const classBody = `export default class GameView extends cc.Component {
${propDecls}${fieldsBlock}
${methodsBlock}
}`;

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

// Add @property decorators for known cc types at end of fields (from original decorators)
const propLines = [
    "@property(cc.Node) node_tishi: cc.Node | null = null;",
    "@property(cc.Node) node_checksize: cc.Node | null = null;",
    "@property(cc.Node) node_mask: cc.Node | null = null;",
    "@property(cc.Node) layer_top: cc.Node | null = null;",
    "@property(cc.Node) layer_mid: cc.Node | null = null;",
    "@property(cc.Node) layer_bottom: cc.Node | null = null;",
    "@property(cc.Sprite) img_life: cc.Sprite | null = null;",
    "@property(cc.Label) txt_levelnum: cc.Label | null = null;",
    "@property(cc.Label) txt_time: cc.Label | null = null;",
    "@property(cc.Label) txt_lastnum: cc.Label | null = null;",
    "@property(cc.Node) node_blue: cc.Node | null = null;",
    "@property(cc.Node) node_red: cc.Node | null = null;",
    "@property(cc.Node) node_yichu: cc.Node | null = null;",
    "@property(cc.Node) node_diaozhuan: cc.Node | null = null;",
    "@property(cc.Slider) slider: cc.Slider | null = null;",
    "@property(cc.Sprite) sp_slderbg: cc.Sprite | null = null;",
    "@property(cc.Node) node_fuzhuad: cc.Node | null = null;",
    "@property(cc.Node) node_fuzhustate: cc.Node | null = null;",
    "@property(cc.Node) node_hardsp: cc.Node | null = null;",
    "@property(cc.Node) node_topBalanceNav: cc.Node | null = null;",
    "@property(cc.Node) node_balanceContainer: cc.Node | null = null;",
    "@property(cc.Node) node_withdrawBtn: cc.Node | null = null;",
    "@property(cc.Node) node_bubbleContainer: cc.Node | null = null;",
    "@property(cc.Label) lbl_balanceText: cc.Label | null = null;",
    "@property(cc.RichText) rich_bubbleText: cc.RichText | null = null;",
    "@property(cc.Node) node_bigBarragePanel: cc.Node | null = null;",
    "@property(cc.RichText) rich_bigBarrageText: cc.RichText | null = null;",
];

// Remove duplicate field declarations for @property fields from fieldsBlock
let cleanedFields = fieldsBlock;
for (const line of propLines) {
    const name = line.match(/\) (\w+):/)?.[1];
    if (name) {
        cleanedFields = cleanedFields.replace(new RegExp(`\\s*${name}(: any)? = [^;\\n]+;\\s*\\n`, "g"), "");
    }
}
cleanedFields = cleanedFields.replace(/\s*showTime = true;\s*\n/, "\n");

const finalClass = `export default class GameView extends cc.Component {
    @property
    showTime = true;

${propLines.map(l => "    " + l).join("\n")}

${cleanedFields}
${methodsBlock}
}`;

const result = imports + finalClass;
fs.writeFileSync(output, result, "utf8");

const defaults = (result.match(/\.default/g) || []).length;
console.log(`Wrote ${output} (${result.length} bytes), remaining .default: ${defaults}`);
