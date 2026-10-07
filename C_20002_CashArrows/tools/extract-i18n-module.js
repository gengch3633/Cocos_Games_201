const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(
    path.join(__dirname, "../AA_Project_Decrypt/assets/main/index.cbc7e.js"),
    "utf8"
);
const start = src.indexOf("I18nLabel: [ function");
const rfPop = src.indexOf("cc._RF.pop();", start);
const depsStart = src.indexOf("}, {", rfPop);
const depsEnd = src.indexOf("} ],", depsStart) + 4;
const mod = src.substring(start, depsEnd);
console.log(mod);
console.error("length:", mod.length);
