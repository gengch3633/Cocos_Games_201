/**
 * Fix corrupted string literals in assets/scripts/third/*.ts
 * by comparing against AA_Project_Decrypt/assets/main/index.cbc7e.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const TS_DIR = path.join(ROOT, "assets", "scripts", "third");
const JS_REF = path.join(ROOT, "AA_Project_Decrypt", "assets", "main", "index.cbc7e.js");

const jsContent = fs.readFileSync(JS_REF, "utf8");

/** Extract module chunks keyed by cc._RF.push module name */
function extractModuleChunks(content) {
    const chunks = {};
    const re = /cc\._RF\.push\(\w+,\s*"[^"]+",\s*"([^"]+)"\)/g;
    let match;
    const positions = [];
    while ((match = re.exec(content)) !== null) {
        positions.push({ name: match[1], start: match.index });
    }
    for (let i = 0; i < positions.length; i++) {
        const end = i + 1 < positions.length ? positions[i + 1].start : content.length;
        chunks[positions[i].name] = content.slice(positions[i].start, end);
    }
    return chunks;
}

/** Extract string literals from source code */
function extractStrings(source) {
    const strings = new Set();
    const re = /(["'`])((?:\\.|(?!\1)[^\\])*)\1/g;
    let m;
    while ((m = re.exec(source)) !== null) {
        strings.add(m[2]);
    }
    return strings;
}

function aggressiveNorm(s) {
    return s.replace(/\s/g, "");
}

function trimNorm(s) {
    return s.trim();
}

/** Build lookup: aggressiveNorm -> Set of original strings */
function buildStringLookup(strings) {
    const byAggressive = new Map();
    const exact = new Set(strings);
    for (const s of strings) {
        const key = aggressiveNorm(s);
        if (!byAggressive.has(key)) byAggressive.set(key, new Set());
        byAggressive.get(key).add(s);
    }
    return { exact, byAggressive };
}

const moduleChunks = extractModuleChunks(jsContent);
const globalJsStrings = extractStrings(jsContent);
const globalLookup = buildStringLookup(globalJsStrings);

/** Get module name from TS file content */
function getModuleName(tsContent, fileName) {
    const m = tsContent.match(/cc\._RF\.push\(\w+,\s*"[^"]+",\s*"([^"]+)"\)/);
    if (m) return m[1];
    return path.basename(fileName, ".ts");
}

function resolveCorrectString(corrupted, moduleLookup) {
    if (moduleLookup.exact.has(corrupted)) return corrupted;

    const trimmed = trimNorm(corrupted);
    if (trimmed !== corrupted) {
        if (moduleLookup.exact.has(trimmed)) return trimmed;
        if (globalLookup.exact.has(trimmed)) return trimmed;
    }

    const aggKey = aggressiveNorm(corrupted);
    const moduleMatches = moduleLookup.byAggressive.get(aggKey);
    if (moduleMatches && moduleMatches.size === 1) {
        return [...moduleMatches][0];
    }
    const globalMatches = globalLookup.byAggressive.get(aggKey);
    if (globalMatches && globalMatches.size === 1) {
        return [...globalMatches][0];
    }

    // Prefer exact trimmed match over spaced variants when both exist in JS
    if (trimmed !== corrupted && moduleLookup.exact.has(trimmed)) {
        return trimmed;
    }

    // Prefer shortest match when multiple (usually the clean identifier)
    if (moduleMatches && moduleMatches.size > 1) {
        const sorted = [...moduleMatches].sort((a, b) => a.length - b.length);
        if (moduleLookup.exact.has(trimmed)) return trimmed;
        return sorted[0];
    }
    if (globalMatches && globalMatches.size > 1) {
        const sorted = [...globalMatches].sort((a, b) => a.length - b.length);
        if (globalLookup.exact.has(trimmed)) return trimmed;
        return sorted[0];
    }

    // Fallback: trim outer spaces for identifier-like strings
    if (trimmed !== corrupted && /^[\w./:@?&=\-+*,|<>[\]{}()#%!'~`^]+$/.test(trimmed)) {
        return trimmed;
    }
    if (trimmed !== corrupted && !/[\u4e00-\u9fff]/.test(corrupted) && !/\s/.test(trimmed)) {
        return trimmed;
    }
    // Chinese / mixed: trim outer spaces if inner has no leading/trailing space issues
    if (trimmed !== corrupted && trimNorm(trimmed) === trimmed) {
        const innerTrimmed = trimmed.replace(/\s+([,，。:：;；!！?？])/g, "$1").replace(/([,，。:：;；!！?？])\s+/g, "$1");
        if (moduleLookup.exact.has(innerTrimmed)) return innerTrimmed;
        if (globalLookup.exact.has(innerTrimmed)) return innerTrimmed;
        // Chinese log strings: just trim outer spaces
        if (/[\u4e00-\u9fff]/.test(trimmed)) return trimmed;
    }

    return null;
}

function needsFix(str) {
    if (str !== trimNorm(str)) return true;
    // Internal space around identifiers: " word " or "a b c" where aggressive differs from common patterns
    if (/"\s+\w/.test('"' + str + '"') || /\w\s+"/.test('"' + str + '"')) return false;
    // Pattern: space after/before punctuation that shouldn't have space in identifiers
    if (/^\s*[A-Za-z_][A-Za-z0-9_/\\.-]*\s*$/.test(str) && str !== str.trim()) return true;
    // Leading/trailing space
    if (str.startsWith(" ") || str.endsWith(" ")) return true;
    // Internal corruption: " word " single token with spaces
    if (/^ [a-zA-Z_][a-zA-Z0-9_./\\-]* $/.test(" " + str + " ")) return true;
    return str.startsWith(" ") || str.endsWith(" ");
}

function escapeForRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function fixFile(filePath) {
    const content = fs.readFileSync(filePath, "utf8");
    const moduleName = getModuleName(content, filePath);
    const moduleChunk = moduleChunks[moduleName] || "";
    const moduleStrings = moduleChunk ? extractStrings(moduleChunk) : new Set();
    const moduleLookup = buildStringLookup(moduleStrings.size ? moduleStrings : globalJsStrings);

    let result = content;
    const fixes = [];

    // Process double-quoted strings
    result = result.replace(/"((?:\\.|[^"\\])*)"/g, (full, inner) => {
        if (!needsFix(inner)) return full;
        const fixed = resolveCorrectString(inner, moduleLookup);
        if (fixed !== null && fixed !== inner) {
            fixes.push({ from: inner, to: fixed });
            return '"' + fixed + '"';
        }
        return full;
    });

    // Process single-quoted strings (same rules, fewer cases)
    result = result.replace(/'((?:\\.|[^'\\])*)'/g, (full, inner) => {
        if (!needsFix(inner)) return full;
        const fixed = resolveCorrectString(inner, moduleLookup);
        if (fixed !== null && fixed !== inner) {
            fixes.push({ from: inner, to: fixed });
            return "'" + fixed + "'";
        }
        return full;
    });

    if (fixes.length > 0) {
        fs.writeFileSync(filePath, result, "utf8");
    }
    return fixes;
}

const tsFiles = fs.readdirSync(TS_DIR).filter((f) => f.endsWith(".ts"));
let totalFixes = 0;
const report = [];

for (const file of tsFiles.sort()) {
    const fixes = fixFile(path.join(TS_DIR, file));
    if (fixes.length) {
        totalFixes += fixes.length;
        report.push({ file, count: fixes.length, samples: fixes.slice(0, 5) });
    }
}

console.log("Fixed " + totalFixes + " strings in " + report.length + " files");
for (const entry of report) {
    console.log("\n" + entry.file + " (" + entry.count + " fixes):");
    for (const s of entry.samples) {
        console.log('  "' + s.from + '" -> "' + s.to + '"');
    }
    if (entry.count > 5) console.log("  ... and " + (entry.count - 5) + " more");
}
