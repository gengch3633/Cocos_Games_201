# -*- coding: utf-8 -*-
"""按 AA_Project_Decrypt 里的原始贴图设置，修复骨骼光效和粒子贴图的导入参数。

原始包里这些特效贴图是预乘透明，并且不进动态图集。
当前工程如果收成普通透明、允许打进图集，滤色光效会铺成白块。

用法（在项目根目录）:
    python fix_effect_textures.py
    python fix_effect_textures.py --dry-run
"""

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DECRYPT_DIR = ROOT / "AA_Project_Decrypt"
ASSETS_DIR = ROOT / "assets"

TEXTURE_EXTS = (".png.meta", ".jpg.meta", ".jpeg.meta", ".webp.meta")
EFFECT_DIR_RE = re.compile(
    r"[\\/](Skeleton|skeleton|Particles|Particle|particle|cue_spine|unkown_sbine|new-skeleton)[\\/]",
    re.IGNORECASE,
)
FLAG_RE = re.compile(r"^\d+,\d+,\d+,\d+,\d+,[01],[01],[01]$")
BOOL_FIELD_RE = {
    "premultiplyAlpha": re.compile(r'("premultiplyAlpha": )(true|false)'),
    "packable": re.compile(r'("packable": )(true|false)'),
}


def walk_files(directory, predicate):
    if not directory.is_dir():
        return
    for path in directory.rglob("*"):
        if path.is_file() and predicate(path):
            yield path


def find_flag_string(node):
    if isinstance(node, str) and FLAG_RE.match(node):
        return node
    if isinstance(node, list):
        for item in node:
            found = find_flag_string(item)
            if found:
                return found
    return None


def load_original_texture_flags():
    """读取解密包中 cc.Texture2D 的 premultiplyAlpha 和 packable。"""
    flags = {}
    for path in walk_files(DECRYPT_DIR, lambda item: item.suffix == ".json"):
        raw = path.read_text(encoding="utf-8")
        if "cc.Texture2D" not in raw:
            continue
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            continue
        if not isinstance(data, list) or len(data) <= 3:
            continue
        types = data[3]
        if not isinstance(types, list) or "cc.Texture2D" not in types:
            continue
        flag = find_flag_string(data)
        if not flag:
            continue
        fields = flag.split(",")
        flags[path.stem] = {
            "premultiply": fields[5] == "1",
            "packable": fields[7] == "1",
        }
    return flags


def replace_bool_field(text, key, value):
    pattern = BOOL_FIELD_RE[key]
    replacement = r"\1" + ("true" if value else "false")
    updated, count = pattern.subn(replacement, text, count=1)
    if count != 1:
        raise ValueError("missing %s in meta" % key)
    return updated


def apply_texture_flags(original_flags, dry_run):
    changed = []
    missing_effect = []
    for meta_path in walk_files(ASSETS_DIR, lambda item: item.name.endswith(TEXTURE_EXTS)):
        text = meta_path.read_text(encoding="utf-8")
        try:
            meta = json.loads(text)
        except json.JSONDecodeError:
            continue
        if meta.get("importer") != "texture" or not meta.get("uuid"):
            continue

        relative = meta_path.relative_to(ASSETS_DIR).as_posix()
        is_effect = EFFECT_DIR_RE.search(str(meta_path)) is not None
        flags = original_flags.get(meta["uuid"])
        if flags is None:
            if is_effect:
                missing_effect.append(relative)
            continue

        want_premultiply = flags["premultiply"]
        want_packable = flags["packable"]
        # 只改特效目录，以及原始包里开启了预乘的贴图。
        if not is_effect and not want_premultiply:
            continue
        if meta.get("premultiplyAlpha") == want_premultiply and meta.get("packable") == want_packable:
            continue

        updated = text
        if meta.get("premultiplyAlpha") != want_premultiply:
            updated = replace_bool_field(updated, "premultiplyAlpha", want_premultiply)
        if meta.get("packable") != want_packable:
            updated = replace_bool_field(updated, "packable", want_packable)
        if not dry_run:
            meta_path.write_text(updated, encoding="utf-8", newline="\n")
        changed.append(
            "%s  premultiplyAlpha=%s packable=%s"
            % (relative, str(want_premultiply).lower(), str(want_packable).lower())
        )
    return changed, missing_effect


def main():
    parser = argparse.ArgumentParser(description="按原始解密包修复特效贴图的预乘透明和图集设置")
    parser.add_argument("--dry-run", action="store_true", help="只打印将要修改的文件，不写盘")
    args = parser.parse_args()

    if not DECRYPT_DIR.is_dir():
        raise SystemExit("找不到解密目录: %s" % DECRYPT_DIR)
    if not ASSETS_DIR.is_dir():
        raise SystemExit("找不到资源目录: %s" % ASSETS_DIR)

    original_flags = load_original_texture_flags()
    changed, missing_effect = apply_texture_flags(original_flags, args.dry_run)

    print("original textures", len(original_flags))
    print("changed", len(changed))
    print("effect metas without original texture", len(missing_effect))
    if changed:
        print("\n".join(changed))
    if missing_effect:
        print("missing:")
        print("\n".join(missing_effect))
    if args.dry_run:
        print("dry-run, no files written")


if __name__ == "__main__":
    main()
