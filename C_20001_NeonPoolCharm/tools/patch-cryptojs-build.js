const fs = require("fs");
const path = require("path");

const buildMain = path.join(__dirname, "../build/web-mobile/assets/main");
const files = fs.readdirSync(buildMain).filter((name) => /^index\..+\.js$/.test(name));
if (files.length === 0) {
    console.error("No main index.*.js found under build/web-mobile/assets/main");
    process.exit(1);
}

for (const file of files) {
    const target = path.join(buildMain, file);
    let source = fs.readFileSync(target, "utf8");
    const oldImport = 'var n=e("./crypto-js"),i=e("./PoolNative")';
    const newImport =
        'var n=e("./crypto-js");n=(n&&n.default&&n.default.enc?n.default:n&&n.enc?n:window.CryptoJS),i=e("./PoolNative")';

    if (!source.includes(oldImport)) {
        console.log(`skip ${file}: import pattern not found`);
        continue;
    }

    source = source.replace(oldImport, newImport);
    const moduleStart = source.indexOf("CoinfinityRideress:[function");
    const moduleEnd = source.indexOf("},{}],", moduleStart);
    if (moduleStart === -1 || moduleEnd === -1) {
        console.error(`failed to locate CoinfinityRideress module in ${file}`);
        process.exit(1);
    }

    const head = source.slice(0, moduleStart);
    const module = source.slice(moduleStart, moduleEnd).replace(/n\.default\./g, "n.");
    const tail = source.slice(moduleEnd);
    fs.writeFileSync(target, head + module + tail);
    console.log(`patched ${file}`);
}
