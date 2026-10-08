const fs = require("fs");
const path = require("path");

const buildMain = path.join(__dirname, "../build/web-mobile/assets/main");
const files = fs.readdirSync(buildMain).filter((name) => /^index\..+\.js$/.test(name));

for (const file of files) {
    const target = path.join(buildMain, file);
    let source = fs.readFileSync(target, "utf8");
    const oldPattern = "return n?n.json:null";
    const newPattern = "return n?(n.default||n).json:null";

    if (!source.includes(oldPattern)) {
        console.log(`skip ${file}: freemode_loadjs pattern not found`);
        continue;
    }

    source = source.replace(oldPattern, newPattern);
    fs.writeFileSync(target, source);
    console.log(`patched ${file}`);
}
