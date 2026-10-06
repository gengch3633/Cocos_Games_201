import pathlib
base = pathlib.Path(r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\assets\scripts\third")
out = pathlib.Path(r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\_dump_hex.txt")
parts = []

def dump_around(name, needle, before=5, after=80):
    data = (base / name).read_text(encoding="utf-8")
    idx = 0
    n = 0
    while n < 3:
        i = data.find(needle, idx)
        if i < 0:
            break
        chunk = data[i:i+after]
        codes = " ".join("%02X" % ord(ch) for ch in chunk)
        chars = "".join(ch if ch.isprintable() else "." for ch in chunk)
        parts.append("%s @%d" % (name, i))
        parts.append(chars)
        parts.append(codes)
        parts.append("")
        idx = i + len(needle)
        n += 1

dump_around("GuideMaskNode.js", "split", after=40)
dump_around("GlobalErrorHandler.js", "replace", after=50)
dump_around("GlobalErrorHandler.js", "application/", after=60)
dump_around("GlobalErrorHandler.js", "stringify(l", after=40)
dump_around("I18nGroup.js", '" function "', after=20)
out.write_text("\n".join(parts), encoding="utf-8")
print("ok")
