import * as fs from 'fs';
import {Browser, Page} from "@playwright/test";

export const host = process.env.HOST;

type TestOptions = {
    id: string;
    portal: string | null;
};

export const readTestOptions = (path: string) =>
    fs.readFileSync(path, 'utf8')
        .split(/\r?\n/)
        .filter(r => r)
        .map(r => {
            const params = r.split(',');
            return {id: params[0].trim(), portal: params[1]?.trim() || null} as TestOptions;
        });

export async function getScreenshot(url: string, page: Page, tag?: string): Promise<Buffer> {
    await page.goto(url, {waitUntil: 'networkidle', timeout: 120000});
    await page.evaluate(() => {
        document.querySelector(".build-version")?.remove();
        document.querySelector(".title-block .image")?.remove();
        document.querySelector(".profiler-results")?.remove();
        document.querySelector("#launcher")?.remove();
        document.querySelector("#site-header")?.remove();
        document.querySelector("#gdpr")?.remove();
    });
    await page.waitForLoadState('domcontentloaded');
    return tag
        ? page.locator(tag).screenshot()
        : page.screenshot({fullPage: true});
}

export async function getBufferToCompare(portal: string, url: string, browser: Browser, page: Page, tag?: string): Promise<Buffer> {
    if (portal) {
        const context = await browser.newContext();
        await login(await context.newPage(), `${portal}.${host}`);
        return await getScreenshot(url, await context.newPage(), tag);
    } else {
        return await getScreenshot(url, page, tag);
    }
}

export async function login(page: Page, host: string) {
    await page.goto(`https://${host}/sys/login`, {waitUntil: 'commit', timeout: 120000});
    await page.type('input[name="EMail"]', process.env.EMAIL);
    await page.type('input[name="Password"]', process.env.PASSWORD);
    await Promise.all(
        [
            page.click('input[type=submit]', {timeout: 120000}),
            page.waitForNavigation({waitUntil: 'networkidle'})
        ]);
}
