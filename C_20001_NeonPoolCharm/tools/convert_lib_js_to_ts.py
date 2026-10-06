# -*- coding: utf-8 -*-
import os

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "scripts", "third")

HEADER = """// @ts-nocheck
const module: any = { exports: {} };
const exports: any = module.exports;
"""


def strip_cc_boilerplate(content: str) -> str:
    lines = content.splitlines()
    out = []
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("cc._RF.push") or stripped.startswith("cc._RF.pop"):
            continue
        if stripped.startswith("let e = require"):
            continue
        if stripped.startswith("let t = module"):
            continue
        if stripped.startswith("let o = exports"):
            continue
        if stripped in ('"use strict"', "'use strict'"):
            continue
        out.append(line)
    return "\n".join(out).strip() + "\n"


def convert_file(name: str, footer: str = "export = module.exports;\n") -> None:
    js_path = os.path.join(ROOT, name)
    ts_name = os.path.splitext(name)[0] + ".ts"
    ts_path = os.path.join(ROOT, ts_name)
    with open(js_path, "r", encoding="utf-8", errors="ignore") as handle:
        body = strip_cc_boilerplate(handle.read())
    ts_content = HEADER + body + footer
    with open(ts_path, "w", encoding="utf-8", newline="\n") as handle:
        handle.write(ts_content)
    print(f"Wrote {ts_path} ({len(ts_content)} bytes)")


def main():
    convert_file("crypto-js.js", footer="\nexport = module.exports;\n")
    convert_file("polyglot.min.js")
    convert_file("regeneratorRuntime.js", footer="\n")
    convert_file("zlib_min.js")
    convert_file("_process.js")


if __name__ == "__main__":
    main()
