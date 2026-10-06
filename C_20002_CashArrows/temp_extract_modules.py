import re
import os

path = r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\AA_Project_Decrypt\assets\main\index.cbc7e.js"
out_dir = r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\temp_extracted"
os.makedirs(out_dir, exist_ok=True)

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

modules = [
    "GameConfigStore", "GameHelper", "GlobalErrorHandler", "GlobalEventMgr", "GuideMaskNode",
    "Handler", "HotUpdateManager", "I18nGroup", "I18nPreviewTables", "I18nSprite",
    "InterfaceMgr", "KdTree", "LanguageHelper", "LanguageService", "Launch",
    "Line", "List", "ListItem", "ListView", "Loading",
]

for name in modules:
    pattern = rf"{name}: \[ function\(e, t(?:, i)?\) \{{"
    m = re.search(pattern, content)
    if not m:
        print(f"MISSING: {name}")
        continue
    start = m.start()
    rest = content[start:]
    pop_idx = rest.find("cc._RF.pop();")
    if pop_idx == -1:
        print(f"NO POP: {name}")
        continue
    after_pop = rest[pop_idx:]
    end_match = re.search(r"\n\}, \{", after_pop)
    end = start + pop_idx + (end_match.start() + 1 if end_match else len("cc._RF.pop();"))
    chunk = content[start:end + 1]
    with open(os.path.join(out_dir, f"{name}.extract.js"), "w", encoding="utf-8") as out:
        out.write(chunk)
    print(f"OK {name}: {len(chunk)} chars")
