import pathlib

files = [
    r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\assets\scripts\third\FlyRewardAnimMgr.js",
    r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\assets\scripts\third\GlobalErrorHandler.js",
    r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\assets\scripts\third\GuideMaskNode.js",
    r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\assets\scripts\third\HotUpdateManager.js",
    r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\assets\scripts\third\I18nGroup.js",
    r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\assets\scripts\third\I18nSprite.js",
]
out = pathlib.Path(r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\_dump_strings.txt")
parts = []
for f in files:
    p = pathlib.Path(f)
    data = p.read_bytes()
    parts.append("=" * 80)
    parts.append("%s len=%d crlf=%d lf=%d cr=%d" % (p.name, len(data), data.count(b"\r\n"), data.count(b"\n"), data.count(b"\r")))
    text = data.decode("utf-8")
    for i, line in enumerate(text.splitlines(), 1):
        if '"' in line or "function" in line or "e(" in line or "/" in line or "typeof" in line:
            parts.append("%4d|%s" % (i, repr(line)))
out.write_text("\n".join(parts), encoding="utf-8")
print("wrote", out)
