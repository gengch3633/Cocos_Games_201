import pathlib

base = pathlib.Path(r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\assets\scripts\third")
out = pathlib.Path(r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\_dump_bytes.txt")
parts = []

def show(name, start, end):
    data = (base / name).read_bytes()
    chunk = data[start:end]
    parts.append("==== %s bytes %d:%d ====" % (name, start, end))
    parts.append(repr(chunk))

# Find interesting slices by searching
needles = {
    "GuideMaskNode.js": [b"split", b"indexOf", b"continue", b"object"],
    "GlobalErrorHandler.js": [b"setRequestHeader", b"replace", b"stringify", b"Content"],
    "HotUpdateManager.js": [b"projectCfg", b"_temp", b"Content- type", b"remote- asset", b"1.0.0"],
    "FlyRewardAnimMgr.js": [b"flyIcon", b"backOut", b"AudioMgr", b"game "],
    "I18nGroup.js": [b"function", b"tooltip", b"InterfaceMgr"],
    "I18nSprite.js": [b"tooltip", b"loadRes failed", b"ResMgr", b"ui "],
}
for name, ns in needles.items():
    data = (base / name).read_bytes()
    parts.append("\n######## %s ########" % name)
    for n in ns:
        idx = 0
        c = 0
        while True:
            i = data.find(n, idx)
            if i < 0 or c > 6:
                break
            lo = max(0, i - 40)
            hi = min(len(data), i + 120)
            parts.append("--- %r at %d ---" % (n, i))
            parts.append(repr(data[lo:hi]))
            idx = i + len(n)
            c += 1

out.write_text("\n".join(parts), encoding="utf-8")
print("ok", out)
