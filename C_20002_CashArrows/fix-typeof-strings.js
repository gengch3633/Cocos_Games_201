const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "assets", "scripts");
const reps = [
    ['" function "', '"function"'],
    ['" object "', '"object"'],
    ['" string "', '"string"'],
    ['" number "', '"number"'],
    ['" boolean "', '"boolean"'],
    ['" undefined "', '"undefined"'],
];

function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(full);
            continue;
        }
        if (!entry.name.endsWith(".ts")) continue;
        let text = fs.readFileSync(full, "utf8");
        let next = text;
        for (const [from, to] of reps) {
            next = next.split(from).join(to);
        }
        if (next !== text) {
            fs.writeFileSync(full, next);
            console.log("fixed", full);
        }
    }
}

walk(root);
