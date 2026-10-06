import os
import re

from temp_js_to_ts import (
    build_imports,
    collect_paths,
    fix_cc_helpers,
    fix_exports,
    map_path,
    module_name_for_path,
    replace_e_calls,
    strip_bundle_wrapper,
)

EXTRACT_DIR = r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\temp_extracted"
OUT_DIR = r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\assets\scripts\third"
JS_DIR = OUT_DIR

EXTRA_PATH_MAP = {
    "../migration-bundle/business-common/report/BusinessAnalyticsService": "./BusinessAnalyticsService",
    "../migration-bundle/business-common/data/SystemDataStore": "./SystemDataStore",
    "../../src/framework/Platform/NativeSdkBridgeAdapter": "./NativeSdkBridgeAdapter",
    "../../src/middle/MiddleProjectAdapterConfig": "./MiddleProjectAdapterConfig",
    "../BusinessCommonConfig": "./BusinessCommonConfig",
    "./UserData": "./UserData",
    "./ClientDataStore": "./ClientDataStore",
    "./reusable/i18n/LanguageService": "./LanguageService",
    "../migration-bundle/business-common/ad/AdManager": "./AdManager",
    "../migration-bundle/business-common/ad/AdLegacyBridge": "./AdLegacyBridge",
    "./Platform": "./Platform",
    "./GEMgr": "./GEMgr",
    "./RTLNoMirror": "./RTLNoMirror",
    "./LanguageService": "./LanguageService",
}


def map_path_batch(path: str) -> str:
    if path in EXTRA_PATH_MAP:
        return EXTRA_PATH_MAP[path]
    return map_path(path)


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
        r'e\("((?:\./|\.\./)[^"]+|[A-Z][A-Za-z0-9_]*)"\)',
        repl,
        body,
    )


def fix_t_exports(body: str) -> str:
    body = re.sub(
        r"t\.exports = (\w+);\nt\.exports\.default = \1;",
        r"export default \1;",
        body,
    )
    body = re.sub(r"t\.exports = (\w+);", r"export default \1;", body)
    return body


def fix_nodepool_extends(body: str) -> str:
    body = re.sub(
        r"var n = __extends, a = __awaiter, o = __generator;\n",
        "const { __extends, __awaiter, __generator } = cc;\nconst n = __extends;\nconst a = __awaiter;\nconst o = __generator;\n",
        body,
    )
    body = re.sub(
        r"var n = __extends;\n",
        "const { __extends } = cc;\nconst n = __extends;\n",
        body,
    )
    body = re.sub(
        r"var n = __extends, a = __decorate;\n",
        "const { __extends, __decorate } = cc;\nconst n = __extends;\nconst a = __decorate;\n",
        body,
    )
    return body


def convert_standard(name: str, body: str) -> str:
    paths = collect_paths(body)
    body = replace_e_calls_batch(body)
    body = fix_exports(body)
    body = fix_nodepool_extends(body)
    imports = build_imports_batch(paths)
    return f"// @ts-nocheck\n{imports}\n\n{body}"


def convert_t_exports(name: str, body: str) -> str:
    paths = collect_paths(body)
    body = replace_e_calls_batch(body)
    body = re.sub(r'Object\.defineProperty\(i, "__esModule", \{[\s\S]*?\}\);\n', "", body)
    body = fix_nodepool_extends(body)
    body = fix_t_exports(body)
    imports = build_imports_batch(paths)
    return f"// @ts-nocheck\n{imports}\n\n{body}"


def convert_newbie_guide(body: str) -> str:
    body = replace_e_calls_batch(body)
    body = fix_exports(body)
    body = body.replace(
        'var t = e("../migration-bundle/business-common/data/SystemDataStore")',
        "var t = SystemDataStore",
    )
    return """// @ts-nocheck
import UserData from "./UserData";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import SystemDataStore from "./SystemDataStore";

""" + body


def convert_platform_bridge(body: str) -> str:
    body = replace_e_calls_batch(body)
    body = fix_exports(body)
    body = body.replace(
        "BusinessCommonConfig.BUSINESS_COMMON_CONFIG.defaultLanguage",
        "BusinessCommonConfig.BUSINESS_COMMON_CONFIG.defaultLanguage",
    )
    return """// @ts-nocheck
import NativeSdkBridgeAdapter from "./NativeSdkBridgeAdapter";
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";
import * as BusinessCommonConfig from "./BusinessCommonConfig";

""" + body


def convert_pool_from_js() -> str:
    return """export default class Pool<T = unknown> {
    lendArr: T[] = [];
    arr: T[] = [];
    validAction: (item: T | null | undefined) => boolean = () => true;
    createAction?: () => T;

    private _isInit = false;
    private _capacity = 0;

    constructor(capacity = 0) {
        this._capacity = capacity;
    }

    get isInit(): boolean {
        return this._isInit;
    }

    setCreateAction(action: () => T): this {
        this.createAction = action;
        this._isInit = true;
        return this;
    }

    setValidAction(action: (item: T | null | undefined) => boolean): this {
        this.validAction = action;
        return this;
    }

    get size(): number {
        return this.arr.length;
    }

    get capacity(): number {
        return this._capacity;
    }

    set capacity(value: number) {
        this._capacity = value;
        this.resize();
    }

    resize(): void {
        let excess = this.arr.length + this.lendArr.length - this._capacity;
        if (excess <= 0) {
            return;
        }
        for (let i = 0; i < excess; i++) {
            const item = this.arr.shift();
            if (item === null || item === undefined) {
                this.lendArr.shift();
            }
        }
    }

    get(): T | null {
        let item: T | null = null;
        if (this.arr.length > 0) {
            item = this.arr.shift() ?? null;
        } else if (this._capacity <= 0 || this._capacity > this.lendArr.length) {
            if (!this.createAction) {
                return null;
            }
            item = this.createAction();
        } else {
            if (this.lendArr.length <= 0) {
                return null;
            }
            item = this.lendArr.shift() ?? null;
        }
        if (this.validAction(item)) {
            if (this.lendArr.indexOf(item as T) < 0) {
                this.lendArr.push(item as T);
            }
            return item;
        }
        return this.get();
    }

    put(item: T): boolean {
        if (!this.validAction(item)) {
            const index = this.lendArr.indexOf(item);
            if (index >= 0) {
                this.lendArr.splice(index, 1);
            }
            return false;
        }
        if (this.arr.indexOf(item) >= 0) {
            return false;
        }
        const lendIndex = this.lendArr.indexOf(item);
        if (lendIndex >= 0) {
            this.lendArr.splice(lendIndex, 1);
        }
        this.arr.push(item);
        return true;
    }

    getLendArr(): T[] {
        return this.lendArr;
    }

    recoverAllLends(): void {
        while ((this.lendArr?.length ?? 0) > 0) {
            const item = this.lendArr.shift();
            this.put(item as T);
        }
    }

    clear(): void {
        this.lendArr = [];
        this.arr = [];
    }
}
"""


def convert_platform() -> str:
    return """export enum RewardVideoState {
    PlaySuccess = 0,
    PlayErr = 1,
    Close = 2,
    CloseReward = 3,
}
"""


def convert_obstacle() -> str:
    return """import Vector2 from "./Vector2";

export default class Obstacle {
    point: Vector2 = new Vector2();
    next: Obstacle | null = null;
    previous: Obstacle | null = null;
    direction = 0;
    convex = false;
    id = 0;
}
"""


def convert_player_data_store(body: str) -> str:
    body = replace_e_calls_batch(body)
    body = fix_exports(body)
    return """// @ts-nocheck
import ClientDataStore from "./ClientDataStore";

""" + body


MODULES_STANDARD = [
    "NodePool",
    "NodePoolMgr",
    "NumberRoll",
    "NumberUtils",
    "PixelClick",
    "RVOMath",
    "Random",
    "RedDotCompoent",
    "RedDotMgr",
]

MODULES_T_EXPORTS = [
    "RTLFontService",
    "RTLLayoutAdapter",
    "RTLMirror",
    "RTLNoMirror",
]


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
    write("Pool", convert_pool_from_js())
    write("Platform", convert_platform())
    write("Obstacle", convert_obstacle())

    write("NewbieGuideFlow", convert_newbie_guide(load_extract("NewbieGuideFlow")))
    write("PlatformBridge", convert_platform_bridge(load_extract("PlatformBridge")))
    write("PlayerDataStore", convert_player_data_store(load_extract("PlayerDataStore")))

    for name in MODULES_STANDARD:
        write(name, convert_standard(name, load_extract(name)))

    for name in MODULES_T_EXPORTS:
        write(name, convert_t_exports(name, load_extract(name)))


if __name__ == "__main__":
    main()
