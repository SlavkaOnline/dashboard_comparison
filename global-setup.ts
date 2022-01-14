import {chromium, FullConfig, Page} from '@playwright/test';

const host = process.env.HOST;

export async function login(page: Page, host: string) {
    await page.goto(`https://${host}/sys/login`, { waitUntil: 'commit', timeout: 120000 });
    await page.type('input[name="EMail"]', process.env.EMAIL);
    await page.type('input[name="Password"]', process.env.PASSWORD);
    await Promise.all(
        [
            page.click('input[type=submit]', { timeout: 120000 }),
            page.waitForNavigation({waitUntil: 'networkidle'})
        ]);
}

async function globalSetup(config: FullConfig) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await login(page, host);
    await page.context().storageState({ path: 'storageState.json' });
    await browser.close();
}

export default globalSetup;
