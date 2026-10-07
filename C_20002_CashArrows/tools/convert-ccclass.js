/**
 * Convert cc.Class webpack bundle to TypeScript preserving cc.Class structure.
 */
const fs = require("fs");

const inputPath = process.argv[2];
const outputPath = process.argv[3];
const className = process.argv[4] || "DefaultClass";

const src = fs.readFileSync(inputPath, "utf8");

function moduleToImportName(modulePath) {
    let name = modulePath.replace(/\.js$/, "");
    if (name.includes("-")) {
        name = name.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
    }
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function moduleToFilePath(modulePath) {
    return "./" + modulePath.replace(/\.js$/, "");
}

const requireMap = new Map();
const reqRe = /(\w+)\s*=\s*(?:\(\s*)?e\("([^"]+)"\)/g;
let m;
while ((m = reqRe.exec(src)) !== null) {
    if (!requireMap.has(m[1])) {
        requireMap.set(m[1], {
            importName: moduleToImportName(m[2]),
            filePath: moduleToFilePath(m[2]),
        });
    }
}

const extraImports = [
    ["cashArrowSetView", "./cashArrowSetView"],
    ["cashArrowCheckView", "./cashArrowCheckView"],
    ["NativeSdkBridgeAdapter", "./NativeSdkBridgeAdapter"],
    ["Tips", "./Tips"],
];

for (const [name, fp] of extraImports) {
    if (![...requireMap.values()].some((v) => v.filePath === fp)) {
        requireMap.set("__" + name, { importName: name, filePath: fp });
    }
}

function replaceRefs(code) {
    let s = code;
    for (const [alias, info] of requireMap) {
        s = s.replace(new RegExp("\\b" + alias + "\\.default\\b", "g"), info.importName);
        s = s.replace(new RegExp("\\b" + alias + "\\.default\\|\\|" + alias + "\\b", "g"), info.importName);
        if (alias.length > 2 || alias.startsWith("__")) {
            s = s.replace(new RegExp("\\b" + alias + "\\.(\\w+)", "g"), info.importName + ".$1");
        }
    }
    s = s.replace(/e\("cashArrowSetView"\)/g, "cashArrowSetView");
    s = s.replace(/e\("cashArrowCheckView"\)/g, "cashArrowCheckView");
    s = s.replace(/e\("NativeSdkBridgeAdapter\.js"\)/g, "NativeSdkBridgeAdapter");
    s = s.replace(/e\("Tips"\)/g, "Tips");
    return s;
}

let body = src;
body = body.replace(/^let e = require;\s*\nlet t = module;\s*\n(?:let i = exports;\s*\n)?/m, "");
body = body.replace(/^"use strict";\s*\n/m, "");
body = body.replace(/cc\._RF\.push\([^)]+\);\s*\n/g, "");
body = body.replace(/cc\._RF\.pop\(\);\s*\n?$/m, "");
body = body.replace(/Object\.defineProperty\(i, "__esModule", \{[\s\S]*?\}\);\s*\n/g, "");
body = body.replace(/^[ \t]*(?:var|let|const)\s+\w+\s*=\s*e\("[^"]+"\),?\s*\n/gm, "");
body = body.replace(/^[ \t]*\w+\s*=\s*e\("[^"]+"\),?\s*\n/gm, "");
body = body.replace(/i\.default = \w+;\s*\n?/g, "");
body = body.replace(/t\.exports = \w+;\s*\n?/g, "");
body = body.replace(/t\.exports\.default = \w+;\s*\n?/g, "");

const classStart = body.indexOf("cc.Class({");
if (classStart < 0) {
    console.error("No cc.Class found");
    process.exit(1);
}
let braceStart = body.indexOf("{", classStart);
let depth = 0;
let classEnd = -1;
for (let i = braceStart; i < body.length; i++) {
    const ch = body[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
        depth--;
        if (depth === 0) {
            classEnd = i;
            break;
        }
    }
}
if (classEnd < 0) {
    console.error("No cc.Class end found");
    process.exit(1);
}
let classBody = body.slice(classStart, classEnd + 1).trim();
classBody = replaceRefs(classBody);

const imports = [...requireMap.values()]
    .map((info) => `import ${info.importName} from "${info.filePath}";`)
    .sort((a, b) => a.localeCompare(b))
    .join("\n");

const output = `${imports}

const ${className} = ${classBody}

export default ${className};
`;

fs.writeFileSync(outputPath, output, "utf8");
console.log("Wrote", outputPath, output.length);
