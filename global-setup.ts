import {chromium, FullConfig} from '@playwright/test';
import {login} from "./Helper";

const host = process.env.HOST;

async function globalSetup(config: FullConfig) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await login(page, host);
    await page.context().storageState({ path: 'storageState.json' });
    await browser.close();
}

export default globalSetup;
