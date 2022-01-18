import {PlaywrightTestConfig} from '@playwright/test';

const config: PlaywrightTestConfig = {
    globalSetup: require.resolve('./global-setup'),
    use: {
        // Tell all tests to load signed-in state from 'storageState.json'.
        storageState: 'storageState.json',
        screenshot: 'only-on-failure',
        defaultBrowserType: 'chromium'
    },
    reporter: [
        ['experimental-allure-playwright'],
        [process.env.CI ? 'dot' : 'line']
    ],
    workers: 2,
};
export default config;
