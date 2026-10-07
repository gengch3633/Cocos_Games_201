const fs = require("fs");
const path = require("path");
const buildPath = path.join(__dirname, "../build/web-mobile/assets/main/index.d71cc.js");
const c = fs.readFileSync(buildPath, "utf8");
console.log("I18nLabel module:", c.includes("I18nLabel:[function"));
console.log("RF id:", c.includes("babbbYixnxEDqnCwfXEfhoz"));
console.log("In module list:", c.includes('"I18nLabel","GlobalEventMgr"'));
