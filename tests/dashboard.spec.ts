import {test, expect} from '@playwright/test';
import {getBufferToCompare, host, readTestOptions} from "../Helper";

test.setTimeout(120000);

const dashboards = readTestOptions('./options/dashboards.txt')

for (const dashboard of dashboards) {
    test(`dashboard  ${dashboard.id}`, async ({page, browser}) => {

        const url = dashboard.portal
            ? `https://${dashboard.portal}.${host}/resource/embed/${dashboard.id}`
            : `https://${host}/resource/embed/${dashboard.id}`;

        let buffer: Buffer = await getBufferToCompare(dashboard.portal, url, browser, page);
        const name = dashboard.portal ? `${dashboard.portal}-${dashboard.id}.png` : `${dashboard.id}.png`;
        await expect(buffer).toMatchSnapshot(name);
    });
}
