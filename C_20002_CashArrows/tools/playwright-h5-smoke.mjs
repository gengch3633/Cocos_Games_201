import { chromium } from "playwright";

const BASE_URL = process.env.H5_URL || "http://localhost:8000/";
const TIMEOUT_MS = 120000;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 420, height: 800 } });

    const logs = [];
    page.on("console", (msg) => {
        const text = msg.text();
        logs.push(text);
        if (/Loading|Lobby|gameView|ConfigMgr|FAIL|error/i.test(text)) {
            console.log("[browser]", text);
        }
    });
    page.on("pageerror", (err) => console.error("[pageerror]", err.message));

    await page.addInitScript(() => {
        window.__ARROW_ENABLE_LOG__ = true;
        try {
            localStorage.setItem("arrow_enable_log", "1");
        } catch (e) {}
    });

    console.log("Open", BASE_URL);
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: TIMEOUT_MS });

    const canvas = page.locator("#GameCanvas");
    await canvas.waitFor({ state: "visible", timeout: TIMEOUT_MS });

    let passed = false;
    const started = Date.now();
    while (Date.now() - started < TIMEOUT_MS) {
        const probe = await page.evaluate(() => {
            const scene = cc.director.getScene();
            const sceneName = scene ? scene.name : "";
            const canvas = cc.find("Canvas");
            const layerNodes = canvas ? canvas.children.map((n) => n.name) : [];
            const gameNodes = [];
            cc.director.getScene()?.walk((node) => {
                if (/gameView|layer_|node_game|snake|arrow/i.test(node.name)) {
                    gameNodes.push(node.name + (node.active ? "" : "(inactive)"));
                }
            });
            const uiMgrShow = !!(window.__gameViewOpened);
            return { sceneName, layerNodes, gameNodes: gameNodes.slice(0, 30), uiMgrShow };
        }).catch(() => null);

        if (probe) {
            console.log("[probe]", JSON.stringify(probe));
            const hasGameUi = probe.gameNodes.some((n) => /gameView|node_game|snake/i.test(n));
            if (probe.sceneName === "lobby" && hasGameUi) {
                passed = true;
                break;
            }
        }
        await sleep(2000);
    }

    const shotPath = "tools/playwright-h5-smoke.png";
    await page.screenshot({ path: shotPath, fullPage: true });
    console.log("Screenshot:", shotPath);

    await browser.close();
    if (!passed) {
        console.error("FAIL: game UI not detected after loading");
        console.error("Recent logs:\n" + logs.slice(-40).join("\n"));
        process.exit(1);
    }
    console.log("PASS: lobby + game UI detected");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
