# -*- coding: utf-8 -*-
import pathlib

bundle = pathlib.Path(r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\AA_Project_Decrypt\assets\main\index.cbc7e.js")
out = pathlib.Path(r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\assets\scripts\third\gravityengine.mg.cocoscreator.min.ts")

content = bundle.read_text(encoding="utf-8")
marker = 'cc._RF.push(t, "f92dbN9PUVG348D3e3YaPNj", "gravityengine.mg.cocoscreator.min");'
start = content.find(marker)
if start < 0:
    raise SystemExit("marker not found")

sub = content[start + len(marker):]
end = sub.find("cc._RF.pop();")
if end < 0:
    raise SystemExit("end marker not found")

body = sub[:end].strip()
if "export default" not in body:
    body += "\nexport default q;\n"

out.write_text("// @ts-nocheck\n\n" + body, encoding="utf-8")
print(f"Extracted {len(body)} chars to {out}")
