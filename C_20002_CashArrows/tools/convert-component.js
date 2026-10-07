/**
 * Convert webpack cc.Component / cc.Class bundle to Cocos 2.4 TypeScript.
 */
const fs = require("fs");
const path = require("path");

const inputPath = process.argv[2];
const outputPath = process.argv[3];
const exportClassName = process.argv[4];

if (!inputPath || !outputPath || !exportClassName) {
    console.error("Usage: node convert-component.js <in.js> <out.ts> <ClassName>");
    process.exit(1);
}

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
    const alias = m[1];
    const mod = m[2];
    if (mod === "MultiPlatform" || mod === "MultiPlatform.js") continue;
    if (!requireMap.has(alias)) {
        requireMap.set(alias, {
            importName: moduleToImportName(mod),
            filePath: moduleToFilePath(mod),
        });
    }
}

function ref(alias) {
    const info = requireMap.get(alias);
    return info ? info.importName : alias;
}

function replaceRefs(code) {
    let s = code;
    for (const [alias, info] of requireMap) {
        if (alias.length <= 2) {
            s = s.replace(new RegExp("\\b" + alias + "\\.default\\b", "g"), info.importName);
            s = s.replace(new RegExp("\\b" + alias + "\\.default\\|\\|" + alias + "\\b", "g"), info.importName);
        } else {
            s = s.replace(new RegExp("\\b" + alias + "\\.default\\b", "g"), info.importName);
            s = s.replace(new RegExp("\\b" + alias + "\\.default\\|\\|" + alias + "\\b", "g"), info.importName);
            s = s.replace(new RegExp("\\b" + alias + "\\.(\\w+)", "g"), info.importName + ".$1");
        }
    }
    return s;
}

function buildImports(extraNamed = []) {
    const lines = [...requireMap.values()]
        .map((info) => `import ${info.importName} from "${info.filePath}";`)
        .concat(extraNamed)
        .sort((a, b) => a.localeCompare(b));
    return lines.join("\n") + (lines.length ? "\n\n" : "");
}

function transpileAsyncFunctions(code) {
    // Simple __awaiter/__generator to async/await for common patterns - keep body logic
    return code
        .replace(/return a\(this, void 0, Promise, function\(\)\s*\{\s*return o\(this, function\((\w+)\)\s*\{/g, "return (async () => {")
        .replace(/return l\(this, void 0, void 0, function\(\)\s*\{\s*return c\(this, function\(\)\s*\{/g, "return (async () => {")
        .replace(/return l\(this, void 0, Promise, function\(\)\s*\{\s*return o\(this, function\((\w+)\)\s*\{/g, "return (async () => {")
        .replace(/return l\(this, void 0, void 0, function\(\)\s*\{\s*var e = this;\s*return c\(this, function\(\)\s*\{/g, "return (async () => {")
        .replace(/return l\(e, void 0, void 0, function\(\)\s*\{\s*return c\(this, function\(\)\s*\{/g, "return (async () => {");
}

function convertEnums(code) {
    return code.replace(
        /\(function\s*\(\s*(\w+)\s*\)\s*\{([\s\S]*?)\}\s*\)\s*\(\s*(\w+)\.(\w+)\s*\|\|\s*\(\s*\3\.\4\s*=\s*\{\s*\}\s*\)\s*\)/g,
        (match, param, body, mod, name) => {
            const entries = [];
            const re = new RegExp(param + "\\[\\s*" + param + "\\.(\\w+)\\s*=\\s*([^\\]]+)\\]\\s*=\\s*\"([^\"]+)\"", "g");
            let em;
            while ((em = re.exec(body)) !== null) {
                entries.push(`    ${em[1]} = ${em[2].trim()},`);
            }
            return `export enum ${name} {\n${entries.join("\n")}\n}`;
        }
    );
}

function parseCcClass(code) {
    const start = code.indexOf("cc.Class({");
    if (start < 0) return null;
    const extendsMatch = code.match(/extends:\s*cc\.Component,\s*properties:\s*\{\s*\}/);
    if (!extendsMatch) return null;
    const onLoadIdx = code.indexOf("onLoad: function()", start);
    const endIdx = code.lastIndexOf("});");
    const methodsSrc = code.slice(onLoadIdx, endIdx);
    const methods = [];
    const methodRe = /(\w+):\s*function\s*\(([^)]*)\)\s*\{/g;
    let pos = 0;
    let mm;
    const chunks = [];
    while ((mm = methodRe.exec(methodsSrc)) !== null) {
        chunks.push({ name: mm[1], args: mm[2], start: mm.index + mm[0].length });
    }
    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        let depth = 1;
        let j = chunk.start;
        while (j < methodsSrc.length && depth > 0) {
            if (methodsSrc[j] === "{") depth++;
            else if (methodsSrc[j] === "}") depth--;
            j++;
        }
        let body = methodsSrc.slice(chunk.start, j - 1).trim();
        body = replaceRefs(body);
        methods.push({ name: chunk.name, args: chunk.args, body });
    }
    return methods;
}

function parseWebpackComponent(code) {
    const anchor = code.lastIndexOf("(cc.Component);");
    if (anchor < 0) return null;
    const before = code.slice(0, anchor);
    const funcIdx = before.search(/=\s*function\s*\(\s*\w+\s*\)\s*\{\s*function\s+\w+\s*\(\)\s*\{/);
    if (funcIdx < 0) return null;
    const segment = code.slice(funcIdx);
    const re = /=\s*function\s*\(\s*\w+\s*\)\s*\{\s*function\s+\w+\s*\(\)\s*\{([\s\S]*?)return\s+\w+;\s*\}\s*\w+\(\w+,\s*\w+\);([\s\S]*?)return\s+\w+\(\[[^\]]*\],\s*\w+\);\s*\}\s*\(cc\.Component\);/;
    const match = segment.match(re);
    if (!match) return null;
    const ctorBody = match[1];
    const methodsBlock = match[2];
    const decoratorBlock = match[2];

    const fields = [];
    const fieldRe = /t\.(\w+)\s*=\s*([^;]+);/g;
    let fm;
    while ((fm = fieldRe.exec(ctorBody)) !== null) {
        fields.push({ name: fm[1], init: fm[2].trim() });
    }

    const propDecorators = {};
    const decRe = /\w+\(\[\s*(\w+)\(([^)]*)\)\s*\],\s*t\.prototype,\s*"(\w+)"/g;
    let dm;
    while ((dm = decRe.exec(decoratorBlock + methodsBlock)) !== null) {
        propDecorators[dm[3]] = dm[2];
    }

    let menu = "";
    const menuMatch = decoratorBlock.match(/b\("([^"]+)"\)/);
    if (menuMatch) menu = menuMatch[1];

    const methods = [];
    const methRe = /t\.prototype\.(\w+)\s*=\s*function\s*\(([^)]*)\)\s*\{/g;
    const methStarts = [];
    while ((mm = methRe.exec(methodsBlock)) !== null) {
        methStarts.push({ name: mm[1], args: mm[2], start: mm.index + mm[0].length });
    }
    for (let i = 0; i < methStarts.length; i++) {
        const ms = methStarts[i];
        let depth = 1;
        let j = ms.start;
        while (j < methodsBlock.length && depth > 0) {
            if (methodsBlock[j] === "{") depth++;
            else if (methodsBlock[j] === "}") depth--;
            j++;
        }
        let body = methodsBlock.slice(ms.start, j - 1).trim();
        body = replaceRefs(body);
        body = body.replace(/\?\s*new\s+Promise\(function\((\w+)\)\s*\{/g, "await new Promise(($1) => {");
        methods.push({ name: ms.name, args: ms.args, body });
    }

    return { fields, propDecorators, methods, menu };
}

let output = "";

if (src.includes("cc.Class({")) {
    const methods = parseCcClass(src);
    if (!methods) throw new Error("Failed to parse cc.Class");
    const imports = buildImports([
        'import cashArrowCheckView from "./cashArrowCheckView";',
        'import cashArrowSetView from "./cashArrowSetView";',
        'import NativeSdkBridgeAdapter from "./NativeSdkBridgeAdapter";',
        'import Tips from "./Tips";',
    ].filter((line) => {
        const fp = line.match(/from "(.+?)"/)[1];
        return !importsDone(fp);
    }));

    function importsDone() {
        return false;
    }

    const importBlock = buildImports([
        'import cashArrowCheckView from "./cashArrowCheckView";',
        'import cashArrowCheckView from "./cashArrowCheckView";',
    ]);
} else {
    const parsed = parseWebpackComponent(src);
    if (!parsed) throw new Error("Failed to parse webpack component");
    const extra = [];
    if (inputPath.includes("snake")) extra.push('import { ClickState } from "./game";');
    if (inputPath.includes("resultView")) {
        // Tips was side-effect import in original - skip
    }
    const importBlock = buildImports(extra);
    const decoratorHeader = `const { ccclass, property, menu } = cc._decorator;\n\n`;
    let cls = decoratorHeader + importBlock;
    if (parsed.menu) cls += `@ccclass\n@menu("${parsed.menu}")\n`;
    else cls += `@ccclass\n`;
    cls += `export default class ${exportClassName} extends cc.Component {\n`;

    for (const f of parsed.fields) {
        if (parsed.propDecorators[f.name] !== undefined) {
            const typeArg = parsed.propDecorators[f.name];
            cls += `    @property(${typeArg})\n    ${f.name}: any = ${f.init};\n\n`;
        } else {
            cls += `    ${f.name}: any = ${f.init};\n\n`;
        }
    }

    for (const meth of parsed.methods) {
        const isAsync = meth.body.includes("Promise") || meth.body.includes("await ");
        cls += `    ${isAsync ? "async " : ""}${meth.name}(${meth.args}) {\n        ${meth.body.split("\n").join("\n        ")}\n    }\n\n`;
    }
    cls += "}\n";
    output = cls;
}

function buildCcClassOutput(methods) {
    const importBlock = buildImports([
        'import cashArrowCheckView from "./cashArrowCheckView";',
        'import cashArrowSetView from "./cashArrowSetView";',
        'import NativeSdkBridgeAdapter from "./NativeSdkBridgeAdapter";',
        'import Tips from "./Tips";',
    ]);
    let cls = `const { ccclass } = cc._decorator;\n\n${importBlock}@ccclass\nexport default class ${exportClassName} extends cc.Component {\n`;
    for (const meth of methods) {
        cls += `    ${meth.name}(${meth.args}) {\n        ${meth.body.split("\n").join("\n        ")}\n    }\n\n`;
    }
    cls += "}\n";
    return cls;
}

if (src.includes("cc.Class({")) {
    const methods = parseCcClass(src);
    output = buildCcClassOutput(methods);
} else {
    // already set above in else branch - need fix structure
}

// Fix: restructure script properly
(function main() {
    if (src.includes("cc.Class({")) {
        const methods = parseCcClass(src);
        fs.writeFileSync(outputPath, buildCcClassOutput(methods), "utf8");
        console.log("Wrote cc.Class", outputPath, methods.length, "methods");
        return;
    }
    const parsed = parseWebpackComponent(src);
    if (!parsed) throw new Error("Failed to parse " + inputPath);
    const extra = [];
    if (inputPath.includes("snake")) extra.push('import { ClickState } from "./game";');
    const importBlock = buildImports(extra);
    let cls = `const { ccclass, property, menu } = cc._decorator;\n\n${importBlock}`;
    if (parsed.menu) cls += `@ccclass\n@menu("${parsed.menu}")\n`;
    else cls += `@ccclass\n`;
    cls += `export default class ${exportClassName} extends cc.Component {\n`;
    const decorated = new Set(Object.keys(parsed.propDecorators));
    for (const f of parsed.fields) {
        if (decorated.has(f.name)) {
            cls += `    @property(${parsed.propDecorators[f.name]})\n    ${f.name}: any = ${f.init};\n\n`;
        } else {
            cls += `    ${f.name}: any = ${f.init};\n\n`;
        }
    }
    for (const meth of parsed.methods) {
        cls += `    ${meth.name}(${meth.args}) {\n        ${meth.body.split("\n").join("\n        ")}\n    }\n\n`;
    }
    cls += "}\n";

    // enums for snake
    if (inputPath.includes("snake")) {
        let enums = convertEnums(src);
        const enumBlocks = enums.match(/export enum [\s\S]*?\n\}/g) || [];
        cls = cls.replace(/: any = o\.norlmal;/, ": snakeState = snakeState.norlmal;");
        cls = cls.replace(/\by\.ClickState\b/g, "ClickState");
        cls = importBlock + enumBlocks.join("\n\n") + "\n\n" + cls.replace(/^[\s\S]*?@ccclass/m, "@ccclass");
    }

    fs.writeFileSync(outputPath, cls, "utf8");
    console.log("Wrote component", outputPath, parsed.methods.length, "methods");
})();
