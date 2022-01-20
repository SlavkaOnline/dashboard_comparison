import {test, expect} from '@playwright/test';
import {getBufferToCompare, host, readTestOptions} from "../Helper";

test.setTimeout(120000);

const atlasPages = readTestOptions('./options/atlas-pages.txt')

for (const atlasPage of atlasPages) {
    test(`atlas ${atlasPage.portal || '' } ${atlasPage.id}`, async ({page, browser}) => {

        const url = atlasPage.portal
            ? `https://${atlasPage.portal}.${host}/${atlasPage.id}`
            : `https://${host}/${atlasPage.id}`;

        let buffer: Buffer = await getBufferToCompare(atlasPage.portal, url, browser, page,  '#site-main');
        const name = atlasPage.portal ? `${atlasPage.portal}-${atlasPage.id}.png` : `${atlasPage.id}.png`;
        await expect(buffer).toMatchSnapshot(name);
    });
}
