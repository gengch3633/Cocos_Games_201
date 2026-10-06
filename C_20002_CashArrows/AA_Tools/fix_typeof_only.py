import re
from pathlib import Path

ROOT = Path("assets/scripts")
TYPES = ["string", "function", "object", "number", "boolean", "undefined"]

for path in ROOT.rglob("*.ts"):
    text = path.read_text(encoding="utf-8")
    original = text
    for t in TYPES:
        spaced = f'" {t} "'
        text = re.sub(rf"{re.escape(spaced)}\s*==\s*typeof", f'"{t}" == typeof', text)
        text = re.sub(rf"typeof\s+([^\s=]+)\s*==\s*{re.escape(spaced)}", rf'typeof \1 == "{t}"', text)
    if text != original:
        path.write_text(text, encoding="utf-8", newline="\n")
