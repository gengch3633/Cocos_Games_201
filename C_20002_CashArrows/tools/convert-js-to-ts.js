/**
 * Converts Cocos Creator webpack ES5 JS to TypeScript (minimal transpile).
 * Usage: node tools/convert-js-to-ts.js <input.js> <output.ts> [--class-name Name]
 */
const fs = require("fs");
const path = require("path");

const inputPath = process.argv[2];
const outputPath = process.argv[3];
const classNameArg = process.argv.indexOf("--class-name");
const forcedClassName = classNameArg >= 0 ? process.argv[classNameArg + 1] : null;

if (!inputPath || !outputPath) {
    console.error("Usage: node convert-js-to-ts.js <input.js> <output.ts> [--class-name Name]");
    process.exit(1);
}

let src = fs.readFileSync(inputPath, "utf8");

// Remove cc._RF boilerplate
src = src.replace(/^let e = require;\s*\nlet t = module;\s*\n(?:let i = exports;\s*\n)?/m, "");
src = src.replace(/^"use strict";\s*\n/m, "");
src = src.replace(/cc\._RF\.push\([^)]+\);\s*\n/g, "");
src = src.replace(/cc\._RF\.pop\(\);\s*\n?$/m, "");
src = src.replace(/Object\.defineProperty\(i, "__esModule", \{[\s\S]*?\}\);\s*\n/g, "");

// Collect require modules
const requireMap = new Map(); // alias -> { modulePath, importName, isDefault }
const requireRegex = /(?:var|let|const)\s+(\w+)\s*=\s*(?:\(\s*)?e\("([^"]+)"\)(?:\s*,\s*e\("[^"]+"\))*\)?/g;
const inlineRequireRegex = /(?:var|let|const)\s+(\w+)\s*=\s*e\("([^"]+)"\)/g;

function moduleToImportName(modulePath) {
    let name = modulePath.replace(/\.js$/, "");
    // kebab-case to PascalCase
    if (name.includes("-")) {
        name = name.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join("");
    }
    return name;
}

function moduleToFilePath(modulePath) {
    let name = modulePath.replace(/\.js$/, "");
    return "./" + name;
}

// Parse top-level requires (multi-line var declarations)
const topRequireBlock = src.match(/^var\s+[\s\S]*?;\s*\n(?=\(?function|var\s+\w+\s*=\s*function|function\s+\w+|const\s+\{)/m);
if (topRequireBlock) {
    const block = topRequireBlock[0];
    const parts = block.split(/,\s*\n/);
    for (const part of parts) {
        const m = part.match(/(\w+)\s*=\s*(?:\(\s*)?e\("([^"]+)"\)/);
        if (m) {
            const alias = m[1];
            const mod = m[2];
            if (mod === "MultiPlatform.js") continue; // side-effect only
            requireMap.set(alias, {
                modulePath: mod,
                importName: moduleToImportName(mod),
                filePath: moduleToFilePath(mod),
            });
        }
    }
    src = src.replace(block, "");
}

// Parse inline requires inside functions
const inlineRequires = [];
let im;
const inlineRe = /(?:var|let|const)\s+(\w+)\s*=\s*e\("([^"]+)"\)/g;
while ((im = inlineRe.exec(src)) !== null) {
    if (!requireMap.has(im[1])) {
        inlineRequires.push({ alias: im[1], modulePath: im[2] });
        requireMap.set(im[1], {
            modulePath: im[2],
            importName: moduleToImportName(im[2]),
            filePath: moduleToFilePath(im[2]),
        });
    }
}

// Remove inline require lines (will use top imports)
src = src.replace(/(?:var|let|const)\s+(\w+)\s*=\s*e\("([^"]+)"\),?\s*\n/g, (match, alias, mod) => {
    if (requireMap.has(alias)) return "";
    return match;
});
// Clean up leftover inline require pairs like: var o = e("LoadingHttpService.js"), r = e("Handler.js"),
src = src.replace(/(?:var|let|const)\s+[\w,\s= e(".\-)]+;\s*\n/g, (match) => {
    if (match.includes('e("')) {
        const aliases = [];
        const re = /(\w+)\s*=\s*e\("([^"]+)"\)/g;
        let m;
        while ((m = re.exec(match)) !== null) {
            aliases.push(m[1]);
            if (!requireMap.has(m[1])) {
                requireMap.set(m[1], {
                    modulePath: m[2],
                    importName: moduleToImportName(m[2]),
                    filePath: moduleToFilePath(m[2]),
                });
            }
        }
        if (aliases.length > 0) return "";
    }
    return match;
});

// Handle try/catch require blocks (MiddleHelper in netErrorView)
src = src.replace(/var\s+\w+\s*=\s*null;\s*\ntry\s*\{[\s\S]*?u\s*=\s*d&&\s*d\.default\?\s*d\.default:\s*d;[\s\S]*?\}\s*catch\([^)]*\)\s*\{[\s\S]*?\}\s*\n/g, "");

// Remove __extends, __decorate, __awaiter declarations
src = src.replace(/var\s+\w+\s*=\s*__extends,\s*\n\s*\w+\s*=\s*__decorate;\s*\n(?:__awaiter,\s*\n__generator;\s*\n)?/g, "");
src = src.replace(/var\s+\w+\s*=\s*__extends,\s*\n\s*\w+\s*=\s*__decorate;\s*\n/g, "");

// Handle cc._decorator extraction
const hasDecorator = src.includes("cc._decorator");
let decoratorImports = "";
if (hasDecorator) {
    src = src.replace(/var\s+\w+\s*=\s*cc\._decorator,\s*\n\s*\w+\s*=\s*\w+\.ccclass,\s*\n\s*\w+\s*=\s*\w+\.property(?:,\s*\n\s*\w+\s*=\s*\w+\.menu)?;\s*\n/g, "");
    src = src.replace(/var\s+\w+\s*=\s*cc\._decorator\.ccclass,\s*\n/g, "");
    src = src.replace(/var\s+\w+\s*=\s*cc\._decorator,\s*\n\s*\w+\s*=\s*\w+\.ccclass;\s*\n\s*\w+\.property;\s*\n/g, "");
    decoratorImports = "const { ccclass, property, menu } = cc._decorator;\n\n";
}

// Replace alias.default with importName for known imports
for (const [alias, info] of requireMap) {
    const re = new RegExp(`\\b${alias}\\.default\\b`, "g");
    src = src.replace(re, info.importName);
    // Also replace bare alias references - careful, only for known patterns
}

// Handle i.default = x or exports patterns
src = src.replace(/i\.default\s*=\s*(\w+);\s*\n?$/m, "");
src = src.replace(/i\.(\w+)\s*=\s*[\s\S]*?;\s*\n/g, (match) => {
    // Keep export assignments for non-component files - handle separately
    return "";
});

// Convert webpack IIFE class to TS class
const classMatch = src.match(/(?:var|let)\s+(\w+)\s*=\s*function\s*\(\s*(\w+)\s*\)\s*\{\s*function\s+(\w+)\s*\(\)\s*\{[\s\S]*?\}\s*\n\s*\w+\(\3,\s*\2\);([\s\S]*?)return\s+\w+\(\[[^\]]+\],\s*\3\);\s*\}\s*\(cc\.Component\);/);

// Build imports
const importSet = new Map();
for (const [, info] of requireMap) {
    if (!importSet.has(info.filePath)) {
        importSet.set(info.filePath, info.importName);
    }
}

// Named exports from game.js
const namedExports = [];
if (src.includes("i.ClickState") || src.includes("i.Direction")) {
    // handled separately
}

const sortedImports = [...importSet.entries()].sort((a, b) => a[0].localeCompare(b[0]));
let importBlock = sortedImports.map(([fp, name]) => `import ${name} from "${fp}";`).join("\n");
if (importBlock) importBlock += "\n\n";

// For component: convert property decorators
src = src.replace(/\w+\(\[(\w+(?:\([^)]*\))?)\],\s*(\w+)\.prototype,\s*"(\w+)"/g, (match, dec, cls, prop) => {
    if (dec === "L" || dec.startsWith("L(")) {
        const typeMatch = dec.match(/L\(([^)]+)\)/);
        if (typeMatch) {
            return `@property(${typeMatch[1]}) ${prop}`;
        }
        return `@property ${prop}`;
    }
    return match;
});

// Write output - for complex files, output processed JS-like TS with @ts-nocheck if needed
let output = importBlock + decoratorImports + src;

// Add export default for component classes
const exportClassMatch = output.match(/(?:var|let)\s+(\w+)\s*=\s*function/);
if (exportClassMatch && forcedClassName) {
    output = output.replace(
        /(?:var|let)\s+\w+\s*=\s*function\s*\(\s*\w+\s*\)\s*\{\s*function\s+(\w+)\s*\(\)/,
        `export default class ${forcedClassName} extends cc.Component {\n    constructor() {\n        super();`
    );
}

fs.writeFileSync(outputPath, output, "utf8");
console.log(`Wrote ${outputPath} (${output.length} bytes, ${requireMap.size} imports)`);
