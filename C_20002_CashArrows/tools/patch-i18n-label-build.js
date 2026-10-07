const fs = require("fs");
const path = require("path");

const buildPath = path.join(__dirname, "../build/web-mobile/assets/main/index.d71cc.js");
const refPath = path.join(__dirname, "../AA_Project_Decrypt/assets/main/index.cbc7e.js");

if (!fs.existsSync(buildPath)) {
    console.error("Build file not found:", buildPath);
    process.exit(1);
}

let build = fs.readFileSync(buildPath, "utf8");
if (build.includes("I18nLabel:[function")) {
    console.log("I18nLabel module already present in build.");
    process.exit(0);
}

const ref = fs.readFileSync(refPath, "utf8");
const start = ref.indexOf("I18nLabel: [ function");
const rfPop = ref.indexOf("cc._RF.pop();", start);
const depsEnd = ref.indexOf("} ],", rfPop) + 4;
let mod = ref.substring(start, depsEnd);
mod = mod.replace("I18nLabel: [ function", "I18nLabel:[function");

const insertAfter = "GlobalEventMgr:[function";
const idx = build.indexOf(insertAfter);
if (idx < 0) {
    console.error("Could not find insertion point GlobalEventMgr module.");
    process.exit(1);
}

build = build.slice(0, idx) + mod + build.slice(idx);

const listNeedle = '"GlobalEventMgr"';
const listIdx = build.lastIndexOf(listNeedle);
if (listIdx < 0) {
    console.error("Could not find module list entry for GlobalEventMgr.");
    process.exit(1);
}
build = build.slice(0, listIdx) + '"I18nLabel",' + build.slice(listIdx);

fs.writeFileSync(buildPath, build, "utf8");
console.log("Patched I18nLabel into", buildPath);
