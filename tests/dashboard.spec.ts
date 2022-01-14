import {test, expect, Page, chromium} from '@playwright/test';
import * as fs from 'fs';
import {login} from "../global-setup";

test.setTimeout(120000);

type TestOptions = {
    id: string;
    portal: string | null
};

const host = process.env.HOST;
const config = process.env.CONFIG || './config.txt';

let dashboards: TestOptions[] = fs.readFileSync(config, 'utf8')
    .split(/\r?\n/)
    .filter(r => r)
    .map(r => {
        const params = r.split(',');
        return {id: params[0].trim(), portal: params[1]?.trim() || null};
    });

async function getScreenshot(url: string, page: Page): Promise<Buffer> {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
    await page.evaluate(() => {
        const buildVersion = document.querySelector(".build-version");
        buildVersion?.remove();
    });
    return page.screenshot({ fullPage: true });
}

for (const dashboard of dashboards) {
    test(`comparing  ${dashboard.id}`, async ({page, browser}) => {

        const url = dashboard.portal
            ? `https://${dashboard.portal}.${host}/resource/embed/${dashboard.id}`
            : `https://${host}/resource/embed/${dashboard.id}`;

        let buffer: Buffer;
        if (dashboard.portal) {
            const context = await browser.newContext();
            await login(await context.newPage(), `${dashboard.portal}.${host}`);
            buffer = await getScreenshot(url, await context.newPage());
        } else {
            buffer = await getScreenshot(url, page);
        }
        await expect(buffer).toMatchSnapshot(`${dashboard.id}.png`);
    });
}
