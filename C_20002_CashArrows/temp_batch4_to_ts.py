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

EXTRA_PATH_MAP = {
    "../BusinessCommonConfig": "./BusinessCommonConfig",
    "../../src/framework/Net/descriptors/BusinessRequestDescriptors": "./BusinessRequestDescriptors",
    "../../src/framework/Net/RequestDescriptor": "./RequestDescriptor",
    "./UIDefine": "./UIDefine",
    "sortingDefine": "./sortingDefine",
}


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
        elif name == "SMap":
            lines.append(f'import {{ SMap }} from "{mapped}";')
        else:
            lines.append(f'import {name} from "{mapped}";')
    return "\n".join(lines)


def replace_e_calls_batch(body: str) -> str:
    def repl(match: re.Match[str]) -> str:
        return module_name_for_path(match.group(1))

    return re.sub(
        r'e\("((?:\./|\.\./)[^"]+|[A-Za-z][A-Za-z0-9_]*)"\)',
        repl,
        body,
    )


def fix_exports_safe(body: str) -> str:
    body = re.sub(r'Object\.defineProperty\(i, "__esModule", \{[\s\S]*?\}\);\n', "", body)
    for name in ("SMap", "AgentCfg", "SortingGroup", "SpinePreviewComponent", "PlatformType"):
        body = re.sub(rf"^i\.{name} = void 0;\n", "", body, flags=re.MULTILINE)
        body = re.sub(rf"^i\.{name}\s*=", f"export const {name} =", body, flags=re.MULTILINE)
    body = re.sub(r"^i\.default\s*=", "export default ", body, flags=re.MULTILINE)
    body = re.sub(r"^t\.exports = .*;\n", "", body, flags=re.MULTILINE)
    body = re.sub(r"^t\.exports\.default = .*;\n", "", body, flags=re.MULTILINE)
    return body


def fix_cc_helpers(body: str) -> str:
    replacements = [
        (
            r"var n = __extends, a = __decorate;\n",
            "const { __extends, __decorate } = cc;\nconst n = __extends;\nconst a = __decorate;\n",
        ),
        (
            r"var n = __extends, a = __awaiter, o = __generator;\n",
            "const { __extends, __awaiter, __generator } = cc;\nconst n = __extends;\nconst a = __awaiter;\nconst o = __generator;\n",
        ),
        (
            r"var n = __extends, a = __decorate, o = __awaiter, r = __generator;\n",
            "const { __extends, __decorate, __awaiter, __generator } = cc;\nconst n = __extends;\nconst a = __decorate;\nconst o = __awaiter;\nconst r = __generator;\n",
        ),
        (
            r"var n = __extends;\n",
            "const { __extends } = cc;\nconst n = __extends;\n",
        ),
    ]
    for pattern, replacement in replacements:
        body = re.sub(pattern, replacement, body)
    return body


def convert_standard(name: str, body: str) -> str:
    paths = collect_paths(body)
    body = replace_e_calls_batch(body)
    body = fix_exports_safe(body)
    body = fix_cc_helpers(body)
    imports = build_imports_batch(paths)
    header = f"// @ts-nocheck\n{imports}\n\n" if imports else "// @ts-nocheck\n\n"
    return header + body


def convert_singleton() -> str:
    return """export default class Singleton {
    static ins: Singleton | null = null;

    static getInstance<T extends Singleton>(this: new () => T): T {
        if (!(this as unknown as { ins?: T }).ins) {
            (this as unknown as { ins: T }).ins = new this();
        }
        return (this as unknown as { ins: T }).ins;
    }
}
"""


def convert_request_descriptor() -> str:
    return """export default class RequestDescriptor {
    descriptors: Record<string, { uri?: string; url?: string; enqueue?: boolean }>;

    constructor(descriptors: Record<string, { uri?: string; url?: string; enqueue?: boolean }>) {
        this.descriptors = descriptors;
    }

    get(key: string) {
        return this.descriptors[key] || null;
    }

    getUri(key: string): string {
        const descriptor = this.get(key);
        return descriptor?.uri || "";
    }

    getUrl(key: string): string {
        const descriptor = this.get(key);
        return descriptor?.url || "";
    }

    needEnqueue(key: string): boolean {
        const descriptor = this.get(key);
        return !!descriptor?.enqueue;
    }
}
"""


def convert_string_utils() -> str:
    return """export default class StringUtils {
    static format(template: string, ...args: unknown[]): string {
        if (!template) {
            return "";
        }
        return template.replace(/{(\d+)}/g, (match, index) =>
            args[index] !== undefined ? String(args[index]) : match,
        );
    }

    static formatObject(template: string, values: Record<string, unknown> | null): string {
        if (typeof values !== "object" || values === null) {
            return template;
        }
        return template.replace(/{([^{}]*)}/g, (match, key) =>
            Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match,
        );
    }
}
"""


def convert_sprite_event() -> str:
    return """// @ts-nocheck

cc.js.mixin(cc.Sprite, {
    EventType: {
        SpriteFrameChanged: "spriteframe-changed",
        TrimChanged: "trim-changed",
    },
});
"""


def convert_skeleton_ext() -> str:
    return """// @ts-nocheck

cc.game.once(cc.game.EVENT_ENGINE_INITED, function () {
    cc.js.mixin(sp.Skeleton.prototype, {
        update: function (dt) {
            if (!this.paused) {
                dt *= this.timeScale * sp.timeScale;
                if (this.isAnimationCached()) {
                    if (this._isAniComplete) {
                        if (this._animationQueue.length === 0 && !this._headAniInfo) {
                            const frameCache = this._frameCache;
                            if (frameCache && frameCache.isInvalid()) {
                                frameCache.updateToFrame();
                                const frames = frameCache.frames;
                                this._curFrame = frames[frames.length - 1];
                            }
                            return;
                        }
                        this._headAniInfo || (this._headAniInfo = this._animationQueue.shift());
                        this._accTime += dt;
                        if (this._accTime > this._headAniInfo.delay) {
                            const headAniInfo = this._headAniInfo;
                            this._headAniInfo = null;
                            this.setAnimation(0, headAniInfo.animationName, headAniInfo.loop);
                        }
                        return;
                    }
                    this._updateCache(dt);
                } else {
                    this._updateRealtime(dt);
                }
            }
        },
    });
});
"""


def convert_system_data_store() -> str:
    return """// @ts-nocheck
import { BUSINESS_COMMON_CONFIG } from "./BusinessCommonConfig";
import { BUSINESS_REQUEST_DESCRIPTORS } from "./BusinessRequestDescriptors";
import RequestDescriptor from "./RequestDescriptor";

const requestDescriptor = new RequestDescriptor(BUSINESS_REQUEST_DESCRIPTORS);

const SystemDataStore = new (class {
    gameName = BUSINESS_COMMON_CONFIG.gameName;
    encrypt = 1;
    new_user = 0;
    _languageType = BUSINESS_COMMON_CONFIG.defaultLanguage;

    setLanguageType(languageType) {
        this._languageType = languageType;
    }

    getLanguageType() {
        return this._languageType;
    }

    init_config(config) {
        const isEncrypt = config.is_encrypt;
        const newUser = config.new_user;
        this.encrypt = isEncrypt || 0;
        const normalizedNewUser = newUser != null ? newUser : config.is_new;
        this.new_user = normalizedNewUser ? 1 : 0;
        console.log(
            "[SystemDataStore] init_config: new_user=" +
                this.new_user +
                " raw_new_user=" +
                newUser +
                " raw_is_new=" +
                config.is_new,
        );
    }

    getCDNUrl() {
        return BUSINESS_COMMON_CONFIG.cdnUrl;
    }

    getServerReleaseUrl() {
        return BUSINESS_COMMON_CONFIG.serverDomainPrefix;
    }

    get_request_url() {
        return this.getServerReleaseUrl();
    }

    get_version_url() {
        return this.getServerReleaseUrl() + requestDescriptor.getUri("HotUpdate");
    }

    is_new_user() {
        return this.new_user === 1;
    }
})();

export default SystemDataStore;
"""


def write(name: str, content: str) -> None:
    out_path = os.path.join(OUT_DIR, f"{name}.ts")
    with open(out_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content.rstrip() + "\n")
    print(f"Wrote {out_path} ({len(content)} chars)")


def load_extract(name: str) -> str:
    path = os.path.join(EXTRACT_DIR, f"{name}.extract.js")
    with open(path, "r", encoding="utf-8") as f:
        return strip_bundle_wrapper(f.read())


HAND_WRITTEN = {
    "Singleton": convert_singleton,
    "RequestDescriptor": convert_request_descriptor,
    "StringUtils": convert_string_utils,
    "SpriteEvent": convert_sprite_event,
    "SkeletonExt": convert_skeleton_ext,
    "SystemDataStore": convert_system_data_store,
}

STANDARD = [
    "NetErrorPopupService",
    "RedDotNode",
    "RenderUtils",
    "RequestQueueEngine",
    "ResKeeper",
    "ResLoader",
    "ResMgr",
    "SMap",
    "SceneMgr",
    "ScreenShake",
    "Simulator",
    "SortingGroup",
    "SpinePreviewComponent",
    "SpriteFrames",
]


def main() -> None:
    for name, builder in HAND_WRITTEN.items():
        write(name, builder())

    for name in STANDARD:
        write(name, convert_standard(name, load_extract(name)))


if __name__ == "__main__":
    main()
