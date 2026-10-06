# -*- coding: utf-8 -*-
"""Generate newHand.ts from decrypted bundle source."""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX = os.path.join(ROOT, "AA_Project_Decrypt", "assets", "newHand", "index.js")
OUT = os.path.join(ROOT, "assets", "scripts", "newHand", "newHand.ts")

with open(INDEX, "r", encoding="utf-8", errors="ignore") as handle:
    source = handle.read()

match = re.search(r"f = h = \[(.*?)\]; m < f\.length;", source, re.S)
if not match:
    raise SystemExit("Could not find i18n array in index.js")
i18n_array = match.group(1).strip()

ts = f'''const {{ ccclass, property }} = cc._decorator;

type FrameSDKClass = any;
type FrameDataClass = any;
type EventCallback = (...args: any[]) => void;

let frameSDKCache: FrameSDKClass = null;
function getFrameSDK(): FrameSDKClass {{
    if (!frameSDKCache) {{
        frameSDKCache = cc.js.getClassByName("FrameSDK") || (cc.js as any)._registeredClassNames.FrameSDK;
    }}
    return frameSDKCache;
}}

let frameDataCache: FrameDataClass = null;
function getFrameData(): FrameDataClass {{
    if (!frameDataCache) {{
        frameDataCache = cc.js.getClassByName("FrameData") || (cc.js as any)._registeredClassNames.FrameData;
    }}
    return frameDataCache;
}}

function parseLanguageCode(code: string): string {{
    const hashIndex = code.indexOf("#");
    const normalized = code.substring(0, hashIndex === -1 ? code.length : hashIndex);
    const parts = normalized.split(normalized.indexOf("_") !== -1 ? "_" : "-");
    for (let i = parts.length - 1; i >= 0; i--) {{
        if (parts[i] === "") {{
            parts.splice(i, 1);
        }}
    }}
    if (parts[0].indexOf("zh") !== -1) {{
        parts[0] = "en";
    }}
    return parts.length > 1 ? parts[0] : parts[0];
}}

const i18nEntries: Record<string, string>[] = [
{i18n_array}
];

const replacementMap: Record<string, Record<number, string>> = {{}};
const currentLang = parseLanguageCode(cc.sys.languageCode);
for (const entry of i18nEntries) {{
    const key = entry.key;
    const prefixEnd = key.lastIndexOf("_") + 1;
    const prefix = key.substring(0, prefixEnd);
    const index = parseInt(key.substring(prefixEnd), 10);
    if (replacementMap[prefix] == null) {{
        replacementMap[prefix] = {{}};
    }}
    replacementMap[prefix][index] = entry[currentLang];
}}

function parseParamString(text: string): Record<string, string> {{
    const result: Record<string, string> = {{}};
    const parts = text.split("&");
    for (const part of parts) {{
        if (!part) {{
            continue;
        }}
        const pair = part.split("==");
        pair[1] = pair[1].replace(/%/g, "%25");
        result[pair[0]] = decodeURIComponent(pair[1]);
    }}
    return result;
}}

function translateText(text: string): string {{
    for (const prefix in replacementMap) {{
        const index = text.indexOf(prefix);
        if (index === -1) {{
            continue;
        }}
        const placeholder = text.substring(index + prefix.length, index + prefix.length + 3);
        const slot = parseInt(placeholder, 10);
        const table = replacementMap[prefix];
        if (table && table[slot]) {{
            let translated = text.replace(prefix + placeholder, table[slot]);
            const paramIndex = translated.indexOf("??&");
            if (paramIndex !== -1) {{
                const base = translated.substring(0, paramIndex);
                const paramString = translated.substring(paramIndex + 2);
                const params = parseParamString(paramString);
                let result = base;
                const matches = base.match(/xxx_\\d/g);
                if (matches) {{
                    for (const token of matches) {{
                        result = result.replace(token, params["value" + token.substring(4, 5)]);
                    }}
                }}
                return result;
            }}
            return translated;
        }}
        return text;
    }}
    return text;
}}

const labelStringDescriptor = Object.getOwnPropertyDescriptor(cc.Label.prototype, "string");
Object.defineProperty(cc.Label.prototype, "string", {{
    set(value: string) {{
        labelStringDescriptor.set.call(this, translateText(value.toString()));
    }},
    get() {{
        this._string = translateText(this._string);
        return labelStringDescriptor.get.call(this);
    }},
}});

const richTextStringDescriptor = Object.getOwnPropertyDescriptor(cc.RichText.prototype, "string");
Object.defineProperty(cc.RichText.prototype, "string", {{
    set(value: string) {{
        richTextStringDescriptor.set.call(this, translateText(value.toString()));
    }},
    get() {{
        this._N$string = translateText(this._N$string);
        return richTextStringDescriptor.get.call(this);
    }},
}});

@ccclass
export default class NewHand extends cc.Component {{
    @property(sp.Skeleton)
    skeleton: sp.Skeleton = null;

    @property(cc.Node)
    state1Node: cc.Node = null;

    @property(cc.Node)
    state2Node: cc.Node = null;

    @property(cc.Label)
    welcomeLabel: cc.Label = null;

    @property([cc.Node])
    lightNodes: cc.Node[] = [];

    @property(cc.RichText)
    richText1: cc.RichText = null;

    @property(cc.Label)
    levelLabel: cc.Label = null;

    @property(cc.Node)
    withdrawNode: cc.Node = null;

    @property(cc.Label)
    minBonusLabel: cc.Label = null;

    @property(cc.RichText)
    richText2: cc.RichText = null;

    @property(cc.Sprite)
    progress: cc.Sprite = null;

    @property(cc.Label)
    labelBar: cc.Label = null;

    @property(cc.Label)
    labelBartips: cc.Label = null;

    @property(cc.Label)
    buttonLabel: cc.Label = null;

    @property(cc.Node)
    startButton: cc.Node = null;

    @property(cc.Node)
    light: cc.Node = null;

    earlierStageEvent: EventCallback = null;
    sdyEvent: EventCallback = null;
    logGameEvent: EventCallback = null;
    logLifeEvent: EventCallback = null;
    private _state = 0;

    randomFloat(min: number, max?: number): number {{
        if (Array.isArray(min)) {{
            max = min[1];
            min = min[0];
        }}
        return (max - min) * Math.random() + min;
    }}

    playEffect(name: string, loop = false, callback?: (id: number) => void): void {{
        cc.assetManager.getBundle("newHand").load("Sound/" + name, cc.AudioClip, (_err, clip) => {{
            if (clip) {{
                const audioId = cc.audioEngine.playEffect(clip, loop);
                callback && callback(audioId);
            }} else {{
                cc.warn("没有这个音效", name);
            }}
        }});
    }}

    init(earlierStageEvent: EventCallback, sdyEvent: EventCallback, logGameEvent: EventCallback, logLifeEvent: EventCallback): void {{
        this.earlierStageEvent = earlierStageEvent;
        this.sdyEvent = sdyEvent;
        this.logGameEvent = logGameEvent;
        this.logLifeEvent = logLifeEvent;
    }}

    start(): void {{
        this.logLifeEvent("guide_start");
        this.logGameEvent("thepool_game_new", {{
            object_action: "show",
            object_name: "new_1",
        }}, true);
        this.earlierStageEvent("guide_start", "enter_success");
    }}

    onTouchGo(): void {{
        if (this._state === 0) {{
            this._state = 1;
            this.state1Node.active = false;
            this.state2Node.active = true;
            this.buttonLabel.string = "nkey_008";
            this.skeleton.setAnimation(0, "start2", false);
            this.skeleton.addAnimation(0, "loop2", true);
            this.playEffect("YX_TC_01");
        }} else {{
            this.logLifeEvent("guide_end");
            this.sdyEvent(345, "1");
            getFrameSDK()?.openWindow("Panel_Award_New");
            cc.sys.localStorage.setItem("newHand", "1");
            this.node.destroy();
        }}
    }}

    randomInt(min: number, max?: number): number {{
        if (Array.isArray(min)) {{
            max = min[1];
            min = min[0];
        }}
        return Math.floor((max - min + 1) * Math.random()) + min;
    }}

    onEnable(): void {{
        this._state = 0;
        this.state1Node.active = true;
        this.state2Node.active = false;
        this.skeleton.setAnimation(0, "start", false);
        this.skeleton.addAnimation(0, "loop", true);
        this.playEffect("YX_TC_01");
    }}

    onLoad(): void {{
        this.startButton.active = false;
        this.light.active = false;
        this.progress.node.parent.active = true;
        this.welcomeLabel.string = "nkey_001??&value1==The Pool Quest";
        const frameData = getFrameData();
        const frameSDK = getFrameSDK();
        const newHandConfig = frameData.FRAME_CONF.newHand;
        const people = this.randomInt(newHandConfig.people);
        const withdrawAmount = frameSDK.formatNumber(
            people * this.randomFloat(newHandConfig.random),
            2,
            frameData.FRAME_CONF.RedeemRateConfig[0]
        );
        this.lightNodes.forEach((node) => {{
            node.angle = 0;
            cc.Tween.stopAllByTarget(node);
            cc.tween(node).set({{ angle: 0 }}).to(2, {{ angle: 360 }}).union().repeatForever().start();
        }});
        this.richText1.string =
            "<outline color= #42237C width=3>nkey_003</outline>??&value1==<size=42><color= #FEF865>" +
            frameSDK.formatNumber(people) +
            "</c></size>&value2==<size=50><color= #FEF865>" +
            withdrawAmount +
            "</c></size>";
        this.buttonLabel.string = "nkey_004";
        this.levelLabel.string = "nkey_005??&value1==" + frameSDK.getFirstRedeemRequirement().rdm_1;
        cc.tween(this.withdrawNode)
            .to(0.5, {{ scale: 0.9 }}, {{ easing: "sineInOut" }})
            .to(0.5, {{ scale: 1 }}, {{ easing: "sineInOut" }})
            .union()
            .repeatForever()
            .start();
        this.minBonusLabel.string = frameSDK.formatNumber(30000, 2, frameData.FRAME_CONF.RedeemRateConfig[0]);
        this.richText2.string =
            "<outline color= #42237C width=3>nkey_009??&value1==86%&value2==<size=42><color= #FEF865>30</c></size>";
        let dotIndex = -1;
        this.schedule(() => {{
            dotIndex = (dotIndex + 1) % 3;
            this.labelBartips.string = ".".repeat(dotIndex + 1);
        }}, 0.5);
        this.progress.fillRange = 0;
        cc.tween(this.progress)
            .to(5, {{ fillRange: 0.95 }}, {{
                progress: (start, end, _current, ratio) => {{
                    const value = start + (end - start) * ratio;
                    this.labelBar.string = Math.floor(100 * value) + "%";
                    return value;
                }},
            }})
            .start();
        this.schedule(this.getFrame, 0);
    }}

    getFrame = (): void => {{
        const frameSDK = cc.js.getClassByName("FrameSDK");
        if (frameSDK && frameSDK.Panel) {{
            this.unschedule(this.getFrame);
            frameSDK.addi18nArray(i18nEntries);
            this.progress.node.parent.active = false;
            this.startButton.active = true;
            this.startButton.scale = 1;
            this.light.active = true;
            cc.Tween.stopAllByTarget(this.startButton);
            cc.tween(this.startButton)
                .to(0.2, {{ scale: 1.1 }}, {{ easing: "sineInOut" }})
                .to(0.2, {{ scale: 1 }}, {{ easing: "sineInOut" }})
                .union()
                .repeatForever()
                .start();
        }}
    }};
}}
'''

with open(OUT, "w", encoding="utf-8", newline="\n") as handle:
    handle.write(ts)
print(f"Wrote {OUT} ({len(ts)} bytes)")
