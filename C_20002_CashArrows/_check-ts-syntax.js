const ts = require("typescript");
const path = require("path");

const configPath = path.join(__dirname, "tsconfig.check.json");
const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, __dirname);
const program = ts.createProgram(parsed.fileNames, parsed.options);
const diagnostics = ts.getPreEmitDiagnostics(program);

const SYNTAX_CODES = new Set([
    1002, 1003, 1005, 1010, 1011, 1014, 1015, 1016, 1019, 1028, 1029, 1035, 1038, 1039, 1042, 1044, 1048, 1056, 1068, 1070, 1080, 1081, 1082, 1089, 1090, 1091, 1092, 1095, 1096, 1097, 1099, 1109, 1110, 1111, 1127, 1128, 1144, 1146, 1160, 1161, 1176, 1177, 1185, 1200, 1206, 1218, 1219
]);

const syntaxErrors = diagnostics.filter(d => {
    if (d.category !== ts.DiagnosticCategory.Error) return false;
    const msg = ts.flattenDiagnosticMessageText(d.messageText, "\n");
    if (SYNTAX_CODES.has(d.code)) return true;
    return /(Unexpected token|Unterminated|Expression expected|Invalid character|',' expected|';' expected|Declaration or statement expected|Unterminated string|Unterminated regular expression)/i.test(msg);
});

const byFile = new Map();
for (const d of syntaxErrors) {
    const file = d.file ? d.file.fileName.replace(/\\/g, "/") : "(global)";
    if (!byFile.has(file)) byFile.set(file, []);
    let line = "";
    if (d.file && d.start != null) {
        const pos = d.file.getLineAndCharacterOfPosition(d.start);
        line = `:${pos.line + 1}:${pos.character + 1}`;
    }
    byFile.get(file).push(`${line} ${ts.flattenDiagnosticMessageText(d.messageText, "\n")}`);
}

if (byFile.size === 0) {
    console.log("No syntax errors in", parsed.fileNames.length, "files");
    process.exit(0);
}

for (const [file, msgs] of [...byFile.entries()].sort()) {
    console.log("\n" + file + " (" + msgs.length + ")");
    [...new Set(msgs)].slice(0, 15).forEach(m => console.log("  " + m));
    if (msgs.length > 15) console.log("  ... +" + (msgs.length - 15) + " more");
}
console.log("\nFiles with syntax errors:", byFile.size);
console.log("Total syntax errors:", syntaxErrors.length);
process.exit(1);
