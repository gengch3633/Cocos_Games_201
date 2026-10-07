const fs = require("fs");
const path = require("path");

const input = path.join(__dirname, "../assets/scripts/third/gravityengine.mg.cocoscreator.min.js");
const output = path.join(__dirname, "../assets/scripts/third/gravityengine.mg.cocoscreator.min.ts");

let src = fs.readFileSync(input, "utf8");
src = src.replace(/^let e = require;\r?\nlet t = module;\r?\n"use strict";\r?\ncc\._RF\.push\([^\)]+\);\r?\n/, "");
src = src.replace(/cc\._RF\.pop\(\);\r?\n?$/, "");
src = src.replace(/t\.exports = q;/, "export default q;");

const result = "// @ts-nocheck\n" + src;
fs.writeFileSync(output, result, "utf8");
console.log("Wrote", output, result.length, "bytes");
