import { chromium } from 'playwright';

const URL = process.env.GAME_URL || 'http://localhost:8000';

async function inspectLobby(page) {
  return page.evaluate(() => {
    const scene = window.cc?.director?.getScene?.();
    const canvas = scene?.getChildByName?.('Canvas');
    const gameView = canvas?.getChildByName?.('gameView');
    const bg = canvas?.getChildByName?.('bg');
    const bgSprite = bg?.getComponent?.(window.cc.Sprite);
    const gameViewComp = gameView?.getComponent?.('GameView') || gameView?._components?.map((c) => c.__classname__);

    const countNodes = (node) => {
      if (!node) return 0;
      let n = 1;
      for (const child of node.children || []) n += countNodes(child);
      return n;
    };

    return {
      scene: scene?.name || '',
      canvasChildren: canvas?.children?.map((n) => `${n.name}(${n.children?.length || 0})`) || [],
      gameViewNodeCount: countNodes(gameView),
      gameViewActive: gameView?.active,
      bgActive: bg?.active,
      bgHasFrame: !!bgSprite?.spriteFrame,
      hasGameViewComp: !!gameViewComp,
      canvasSize: canvas ? `${canvas.width}x${canvas.height}` : '',
    };
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      errors.push(`[${msg.type()}] ${msg.text()}`);
    }
  });

  await page.addInitScript(() => {
    localStorage.setItem('arrow_enable_log', '1');
    window.__ARROW_ENABLE_LOG__ = true;
  });

  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 90000 });

  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(2000);
    const state = await inspectLobby(page);
    console.log(`t=${(i + 1) * 2}s`, JSON.stringify(state));
    if (state.scene === 'lobby' && state.gameViewNodeCount > 5) break;
  }

  const final = await inspectLobby(page);
  console.log('\nFINAL:', JSON.stringify(final, null, 2));

  if (errors.length) {
    console.log('\nERRORS (last 20):');
    errors.slice(-20).forEach((e) => console.log(e));
  }

  await browser.close();
  const ok = final.scene === 'lobby' && final.gameViewNodeCount > 5;
  process.exit(ok ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
