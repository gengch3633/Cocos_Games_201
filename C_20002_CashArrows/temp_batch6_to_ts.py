import os
import re

from temp_js_to_ts import (
    collect_paths,
    map_path,
    module_name_for_path,
    strip_bundle_wrapper,
)

EXTRACT_DIR = r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\temp_extracted"
OUT_DIR = r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\assets\scripts\third"
JS_DIR = OUT_DIR

EXTRA_PATH_MAP = {
    "../migration-bundle/business-common/report/BusinessAnalyticsService": "./BusinessAnalyticsService",
    "../migration-bundle/business-common/net/LoadingHttpService": "./LoadingHttpService",
    "../migration-bundle/business-common/core/Handler": "./Handler",
    "../migration-bundle/business-common/data/PlayerDataStore": "./PlayerDataStore",
    "../migration-bundle/src/framework/Platform/NativeSdkBridgeAdapter": "./NativeSdkBridgeAdapter",
    "./reusable/i18n/LanguageService": "./LanguageService",
    "./UIDefine": "./UIDefine",
    "./UIMgr": "./UIMgr",
    "./UserData": "./UserData",
    "./NewbieGuideFlow": "./NewbieGuideFlow",
    "./ArrowRewardService": "./ArrowRewardService",
    "./AppReviewManager": "./AppReviewManager",
    "./BusinessCommonConfig": "./BusinessCommonConfig",
    "./ContactUsService": "./ContactUsService",
    "./CountryAssetService": "./CountryAssetService",
    "./CurrencyFormatService": "./CurrencyFormatService",
    "./FMBaseUI": "./FMBaseUI",
    "./GameConfigStore": "./GameConfigStore",
    "./GameHelper": "./GameHelper",
    "./GuideMaskNode": "./GuideMaskNode",
    "./HotUpdateManager": "./HotUpdateManager",
    "./LanguageHelper": "./LanguageHelper",
    "./ListView": "./ListView",
    "./MaskProgress": "./MaskProgress",
    "./MiddleManager": "./MiddleManager",
    "./MiddleService": "./MiddleService",
    "./NetErrorPopupService": "./NetErrorPopupService",
    "./NumberUtils": "./NumberUtils",
    "./PlatformBridge": "./PlatformBridge",
    "./PlayerDataStore": "./PlayerDataStore",
    "./SystemDataStore": "./SystemDataStore",
    "./UiPageAnalyticsService": "./UiPageAnalyticsService",
    "./commonDefine": "./commonDefine",
    "node-unit": "./node-unit",
    "node-mem-pool": "./node-mem-pool",
}

NAMED_EXPORTS = [
    "KeyValuePair",
    "ObserverObj",
    "ignoreWatch",
    "nameof",
    "createLoadingProjectAdapterOverrides",
]


def map_path_batch(path: str) -> str:
    if path in EXTRA_PATH_MAP:
        return EXTRA_PATH_MAP[path]
    mapped = map_path(path)
    if not mapped.startswith("."):
        mapped = "./" + mapped.split("/")[-1]
    return mapped


def build_imports_batch(paths: list[str]) -> str:
    lines: list[str] = []
    seen: set[str] = set()
    for path in paths:
        mapped = map_path_batch(path)
        name = module_name_for_path(path)
        if mapped in seen:
            continue
        seen.add(mapped)
        if name in ("LanguageService", "CurrencyFormatService", "BusinessCommonConfig"):
            lines.append(f'import * as {name} from "{mapped}";')
        else:
            lines.append(f'import {name} from "{mapped}";')
    return "\n".join(lines)


def replace_e_calls_batch(body: str) -> str:
    def repl(match: re.Match[str]) -> str:
        return module_name_for_path(match.group(1))

    return re.sub(
        r'e\("((?:\./|\.\./)[^"]+|[A-Za-z][A-Za-z0-9_-]*)"\)',
        repl,
        body,
    )


def fix_exports_safe(body: str) -> str:
    body = re.sub(r'Object\.defineProperty\(i, "__esModule", \{[\s\S]*?\}\);\n', "", body)
    for name in NAMED_EXPORTS:
        body = re.sub(rf"^i\.{name} = void 0;\n", "", body, flags=re.MULTILINE)
        body = re.sub(rf"^i\.{name}\s*=", f"export const {name} =", body, flags=re.MULTILINE)
    body = re.sub(r"^i\.default\s*=", "export default ", body, flags=re.MULTILINE)
    body = re.sub(r"^t\.exports = .*;\n", "", body, flags=re.MULTILINE)
    body = re.sub(r"^t\.exports\.default = .*;\n", "", body, flags=re.MULTILINE)
    return body


def fix_cc_helpers(body: str) -> str:
    replacements = [
        (
            r"var n = __spreadArrays;\n",
            "const { __spreadArrays } = cc;\nconst n = __spreadArrays;\n",
        ),
        (
            r"var n, a = __spreadArrays;\n",
            "const { __spreadArrays } = cc;\nlet n;\nconst a = __spreadArrays;\n",
        ),
        (
            r"var n = __extends, a = __decorate;\n",
            "const { __extends, __decorate } = cc;\nconst n = __extends;\nconst a = __decorate;\n",
        ),
        (
            r"var n = __extends, a = __awaiter, o = __generator;\n",
            "const { __extends, __awaiter, __generator } = cc;\nconst n = __extends;\nconst a = __awaiter;\nconst o = __generator;\n",
        ),
        (
            r"var n, a = __extends, o = __awaiter, r = __generator;\n",
            "const { __extends, __awaiter, __generator } = cc;\nlet n;\nconst a = __extends;\nconst o = __awaiter;\nconst r = __generator;\n",
        ),
        (
            r"var n = __extends;\n",
            "const { __extends } = cc;\nconst n = __extends;\n",
        ),
    ]
    for pattern, replacement in replacements:
        body = re.sub(pattern, replacement, body)
    return body


def strip_local_js(content: str) -> str:
    content = re.sub(r'^let e = require;\nlet t = module;\n(?:let i = exports;\n)?', "", content)
    content = re.sub(r'^"use strict";\n', "", content)
    content = re.sub(r'cc\._RF\.push\([^;]+\);\n', "", content)
    content = re.sub(r"\ncc\._RF\.pop\(\);\n?$", "", content)
    content = re.sub(r'Object\.defineProperty\(i, "__esModule", \{[\s\S]*?\}\);\n', "", content)
    content = re.sub(r"^i\.default\s*=", "export default ", content, flags=re.MULTILINE)
    for name in NAMED_EXPORTS:
        body = content
        content = re.sub(rf"^i\.{name} = void 0;\n", "", content, flags=re.MULTILINE)
        content = re.sub(rf"^i\.{name}\s*=", f"export const {name} =", content, flags=re.MULTILINE)
    return content


def convert_standard(name: str, body: str) -> str:
    paths = collect_paths(body)
    body = replace_e_calls_batch(body)
    body = fix_exports_safe(body)
    body = fix_cc_helpers(body)
    imports = build_imports_batch(paths)
    header = f"// @ts-nocheck\n{imports}\n\n" if imports else "// @ts-nocheck\n\n"
    return header + body


def convert_vector2() -> str:
    return """export default class Vector2 {
    x = 0;
    y = 0;

    constructor(x?: number, y?: number) {
        if (x != null) this.x = x;
        if (y != null) this.y = y;
    }

    add(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    minus(other: Vector2): Vector2 {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    multiply(other: Vector2): number {
        return this.x * other.x + this.y * other.y;
    }

    scale(factor: number): Vector2 {
        return new Vector2(this.x * factor, this.y * factor);
    }

    static multiply(a: Vector2, b: Vector2): number {
        return a.x * b.x + a.y * b.y;
    }

    static multiply2(factor: number, vector: Vector2): Vector2 {
        return new Vector2(vector.x * factor, vector.y * factor);
    }

    static division(vector: Vector2, divisor: number): Vector2 {
        return new Vector2(vector.x / divisor, vector.y / divisor);
    }

    static subtract(a: Vector2, b: Vector2): Vector2 {
        return new Vector2(a.x - b.x, a.y - b.y);
    }

    static addition(a: Vector2, b: Vector2): Vector2 {
        return new Vector2(a.x + b.x, a.y + b.y);
    }
}
"""


def convert_common_define() -> str:
    return """export class ObserverObj<T = unknown> {
    value: T;

    constructor(value?: T) {
        if (value) {
            this.value = value;
        }
    }
}

export class KeyValuePair<K = unknown, V = unknown> {
    Key: K;
    Value: V;

    constructor(key: K, value: V) {
        this.Key = key;
        this.Value = value;
    }
}

const commonDefine = {
    ObserverObj,
    KeyValuePair,
};

export default commonDefine;
"""


def convert_index() -> str:
    return """// @ts-nocheck
import nodeUnit from "./node-unit";
import nodeMemPool from "./node-mem-pool";

const NodeMemPool = new nodeMemPool(nodeUnit);

export default {
    NodeMemPool,
};

export { NodeMemPool };
"""


def convert_apply_to_current_project() -> str:
    return """// @ts-nocheck
// Side-effect module registered with Cocos bundle loader.
export {};
"""


def convert_from_local_js(name: str) -> str:
    path = os.path.join(JS_DIR, f"{name}.js")
    with open(path, "r", encoding="utf-8") as f:
        body = strip_local_js(f.read())
    paths = collect_paths(body)
    body = replace_e_calls_batch(body)
    body = fix_cc_helpers(body)
    imports = build_imports_batch(paths)
    header = f"// @ts-nocheck\n{imports}\n\n" if imports else "// @ts-nocheck\n\n"
    return header + body


def convert_gravityengine() -> str:
    path = os.path.join(JS_DIR, "gravityengine.mg.cocoscreator.min.js")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    body = strip_local_js(content)
    return f"// @ts-nocheck\n\n{body}\n"


HAND_WRITTEN = {
    "Vector2": convert_vector2,
    "commonDefine": convert_common_define,
    "index": convert_index,
    "apply-to-current-project": convert_apply_to_current_project,
    "gravityengine.mg.cocoscreator.min": convert_gravityengine,
}

EXTRACT_STANDARD = [
    "Utils",
    "Watch",
    "WaitingUI",
    "appReviewView",
    "arrowSettleRewardView",
    "arrowTaskPopupView",
    "cashArrowCheckView",
    "cashArrowFailView",
    "cashArrowReviveView",
    "cashArrowSetView",
    "cashArrowSettingView",
    "game",
    "gameView",
    "heidong",
    "loading-project-adapter-core",
]

LOCAL_STANDARD = []


def write(name: str, content: str) -> None:
    out_path = os.path.join(OUT_DIR, f"{name}.ts")
    with open(out_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content.rstrip() + "\n")
    print(f"Wrote {out_path} ({len(content)} chars)")


def load_extract(name: str) -> str:
    path = os.path.join(EXTRACT_DIR, f"{name}.extract.js")
    with open(path, "r", encoding="utf-8") as f:
        return strip_bundle_wrapper(f.read())


def main() -> None:
    for name, builder in HAND_WRITTEN.items():
        write(name, builder())

    for name in EXTRACT_STANDARD:
        write(name, convert_standard(name, load_extract(name)))

    for name in LOCAL_STANDARD:
        write(name, convert_from_local_js(name))


if __name__ == "__main__":
    main()
