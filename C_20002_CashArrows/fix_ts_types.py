import re
from pathlib import Path

ROOT = Path("assets/scripts")

TYPEOF_TYPES = ["string", "function", "object", "number", "boolean", "undefined"]


def fix_typeof(text: str) -> str:
    for t in TYPEOF_TYPES:
        spaced = f'" {t} "'
        text = re.sub(rf'{re.escape(spaced)}\s*==\s*typeof', f'"{t}" == typeof', text)
        text = re.sub(rf'typeof\s+([^\s=]+)\s*==\s*{re.escape(spaced)}', rf'typeof \1 == "{t}"', text)
    return text


def split_params(params: str) -> list[str]:
    parts = []
    depth = 0
    current = []
    for ch in params:
        if ch in "([{":
            depth += 1
        elif ch in ")]}":
            depth -= 1
        if ch == "," and depth == 0:
            parts.append("".join(current).strip())
            current = []
        else:
            current.append(ch)
    if current:
        parts.append("".join(current).strip())
    return [p for p in parts if p]


def add_any_to_params(params: str) -> str:
    if not params.strip():
        return params
    fixed = []
    for part in split_params(params):
        if ":" in part or part.startswith("..."):
            fixed.append(part)
            continue
        if "=" in part:
            name, default = part.split("=", 1)
            fixed.append(f"{name.strip()}: any ={default}")
        else:
            fixed.append(f"{part.strip()}: any")
    return ", ".join(fixed)


def add_param_types(text: str) -> str:
    def repl_method(m):
        prefix, params, suffix = m.group(1), m.group(2), m.group(3)
        new_params = add_any_to_params(params)
        if new_params == params:
            return m.group(0)
        return f"{prefix}{new_params}){suffix}"

    text = re.sub(
        r"(\n\s+(?:async\s+)?(?:public\s+|private\s+|protected\s+|static\s+)*\w+\s*\()([^)]*)\)(\s*[:\{])",
        repl_method,
        text,
    )

    def repl_func(m):
        name, params = m.group(1), m.group(2)
        new_params = add_any_to_params(params)
        if new_params == params:
            return m.group(0)
        return f"function {name}({new_params})"

    text = re.sub(r"\bfunction\s+(\w+)\s*\(([^)]*)\)", repl_func, text)

    def repl_arrow(m):
        params = m.group(1)
        new_params = add_any_to_params(params)
        if new_params == params:
            return m.group(0)
        return f"({new_params}) =>"

    text = re.sub(r"\(([^)]*)\)\s*=>", repl_arrow, text)
    return text


def process_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    original = text
    text = fix_typeof(text)
    if "gravityengine.mg.cocoscreator.min" not in path.name:
        text = add_param_types(text)
    if text != original:
        path.write_text(text, encoding="utf-8", newline="\n")
        return True
    return False


if __name__ == "__main__":
    changed = [str(p) for p in ROOT.rglob("*.ts") if process_file(p)]
    print("updated", len(changed), "files")
