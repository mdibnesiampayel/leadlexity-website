import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
const logo = readFileSync(
  new URL('../public/brand/leadlexity-black.png', import.meta.url),
).toString('base64');
const font = readFileSync(
  new URL('../public/fonts/manrope-latin-variable.woff2', import.meta.url),
).toString('base64');
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.setContent(`<!doctype html><html><head><style>
@font-face{font-family:Manrope;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:200 800}*{box-sizing:border-box}body{margin:0;background:#fbfcf9;color:#172820;font-family:Manrope,Arial,sans-serif;padding:52px 64px;height:630px}.logo{width:230px;height:auto;display:block}.top{display:flex;align-items:center;justify-content:space-between}.cross{width:32px;height:32px;position:relative;color:#006e61}.cross:before,.cross:after{content:'';position:absolute;background:currentColor}.cross:before{width:28px;height:1px;top:14px;left:2px}.cross:after{height:28px;width:1px;left:15px;top:1px}.eyebrow{font-size:11px;letter-spacing:1.8px;font-weight:650;margin:54px 0 23px;display:flex;align-items:center;gap:11px}.dot{width:7px;height:7px;background:#02d3be}h1{font-size:79px;line-height:1.14;letter-spacing:-4.5px;font-weight:600;margin:0}h1 span{border-bottom:5px solid #02d3be}.description{color:#626f66;font-size:18px;margin:28px 0 0;letter-spacing:-.3px}.bottom{position:absolute;left:64px;right:64px;bottom:43px;border-top:1px solid #dce3db;padding-top:25px;display:flex;justify-content:space-between;color:#626f66;font-size:10px;letter-spacing:1px}.bottom span:last-child{letter-spacing:.1px;color:#172820}
</style></head><body><div class="top"><img class="logo" src="data:image/png;base64,${logo}" width="1100" height="218" alt="LeadLexity"><div class="cross"></div></div><p class="eyebrow"><span class="dot"></span>DIGITAL GROWTH AGENCY</p><h1>Where Creativity<br>Meets <span>Conversion.</span></h1><p class="description">Digital growth for service-based businesses, worldwide.</p><div class="bottom"><span>CREATIVE THINKING. BUSINESS MINDSET.</span><span>Strategy &nbsp; + &nbsp; Creative &nbsp; + &nbsp; Performance</span></div></body></html>`);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: new URL('../public/og-image.png', import.meta.url).pathname });
await browser.close();
