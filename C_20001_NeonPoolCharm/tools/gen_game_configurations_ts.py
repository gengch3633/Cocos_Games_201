#!/usr/bin/env python3
"""Generate GameConfigurations.ts from decrypt index.js."""

src_path = r"D:\work\github\Unity_Games\Cocos_Games_201\C_20001_NeonPoolCharm\AA_Project_Decrypt\assets\main\index.js"
out_path = r"D:\work\github\Unity_Games\Cocos_Games_201\C_20001_NeonPoolCharm\assets\scripts\third\GameConfigurations.ts"

with open(src_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Lines 15268-17398 (1-indexed): e._customConfig = { ... };
config_lines = lines[15267:17399]
config_text = "".join(config_lines)
config_text = config_text.replace("        e._customConfig = ", "", 1).rstrip()

header = """import * as GlobalConfig from "./GlobalConfig";
import i18n from "./i18n";

export class GameConfigurations {
    static updateNewBallConfig(data: any): void {
        let t: any;
        this._newBallData = data;
        const basicConfig = data == null ? void 0 : data.basicConfig;
        if (basicConfig && typeof basicConfig === "object") {
            const gameConf = basicConfig.GAME_CONF;
            if (typeof gameConf === "object") {
                this._originalGameConfig = gameConf.origin;
                const custom = gameConf.custom;
                if (typeof custom === "object") {
                    this.mergeConfig(this._customConfig, custom);
                    if (custom.gan_move_rad_multy_aim !== null && custom.gan_move_rad_multy_aim !== void 0) {
                        (GlobalConfig as any).gan_move_rad_multy_aim = custom.gan_move_rad_multy_aim;
                    }
                    if (custom.gan_move_rad_multy_normal !== null && custom.gan_move_rad_multy_normal !== void 0) {
                        (GlobalConfig as any).gan_move_rad_multy_normal = custom.gan_move_rad_multy_normal;
                    }
                }
            }
            this._debugCode = ((t = basicConfig.DEBUG_CODE) !== null && t !== void 0 ? t : "").toString();
            const extraLanguages = basicConfig.EXTRA_LANGUAGES;
            if (typeof extraLanguages === "object" && Array.isArray(extraLanguages)) {
                i18n.addi18nArray(extraLanguages);
            }
        }
    }

    static get debugCode(): string {
        return this._debugCode;
    }

    static get newBallData(): any {
        return this._newBallData;
    }

    static get remoteOriginalConfig(): any {
        return this._originalGameConfig;
    }

    static get customConfig(): any {
        return this._customConfig;
    }

    static updateWebConfig(data: any): void {
        let t: any;
        if (data && typeof data === "object") {
            const web = data.WEB;
            if (web && Array.isArray(web)) {
                this.moreGameURLsArray.length = 0;
                (t = this.moreGameURLsArray).push.apply(t, web);
            }
        }
    }

    static mergeConfig(target: any, source: any): any {
        let o: any, n: any;
        for (const key in source) {
            o = target[key];
            n = source[key];
            if (typeof o !== "object" || Array.isArray(o)) {
                target[key] = n;
            } else if (typeof n === "object") {
                this.mergeConfig(o, n);
            }
        }
        return target;
    }

    static moreGameURLsArray: any[] = [];
    static PRIVACY_POLICY = "https://worst41fj.com/privacy.html";
    static _debugCode = "";
    static _newBallData: any = void 0;
    static _originalGameConfig: any = void 0;
    static _customConfig = CONFIG_PLACEHOLDER;
}
"""

content = header.replace("CONFIG_PLACEHOLDER", config_text)

with open(out_path, "w", encoding="utf-8", newline="\n") as f:
    f.write(content)

print(f"Written {out_path} ({len(content.splitlines())} lines)")
