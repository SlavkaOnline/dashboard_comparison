import {PlaywrightTestConfig} from '@playwright/test';

const config: PlaywrightTestConfig = {
    globalSetup: require.resolve('./global-setup'),
    use: {
        // Tell all tests to load signed-in state from 'storageState.json'.
        storageState: 'storageState.json',
        channel: 'chromium',
        screenshot: 'only-on-failure',
    },
    workers: 2,
};
export default config;
