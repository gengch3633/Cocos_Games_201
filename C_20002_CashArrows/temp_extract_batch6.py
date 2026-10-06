import re
import os

path = r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\AA_Project_Decrypt\assets\main\index.cbc7e.js"
out_dir = r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\temp_extracted"
os.makedirs(out_dir, exist_ok=True)

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

modules = [
    "Utils", "Watch", "TemplateListView", "TimeScale", "Tips", "ToggleEvent",
    "TweenScale", "TypeWriter", "TypedEvent", "UIAnimation", "UIDefine",
    "Vector2", "WaitingUI", "appReviewView", "arrowSettleRewardView",
    "arrowTaskPopupView", "cashArrowCheckView", "cashArrowFailView",
    "cashArrowReviveView", "cashArrowSetView", "cashArrowSettingView",
    "commonDefine", "game", "gameView", "heidong", "index",
    "loading-project-adapter-core", "apply-to-current-project",
]

for name in modules:
    pattern = rf'cc\._RF\.push\([^,]+,\s*"[^"]+",\s"{re.escape(name)}"\);'
    m = re.search(pattern, content)
    if not m:
        print(f"MISSING RF: {name}")
        continue
    start = content.rfind(f"{name}: [ function", 0, m.start())
    if start == -1:
        start = content.rfind(f'"{name}": [ function', 0, m.start())
    if start == -1:
        print(f"NO MODULE START: {name}")
        continue
    rest = content[start:]
    pop_idx = rest.find("cc._RF.pop();")
    after_pop = rest[pop_idx:]
    end_match = re.search(r"\n\}, \{", after_pop)
    end = start + pop_idx + (end_match.start() + 1 if end_match else len("cc._RF.pop();"))
    chunk = content[start : end + 1]
    out_path = os.path.join(out_dir, f"{name}.extract.js")
    with open(out_path, "w", encoding="utf-8") as out:
        out.write(chunk)
    print(f"OK {name}: {len(chunk)} chars")
