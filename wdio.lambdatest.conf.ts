import { config as sharedConfig } from './wdio.shared.conf'

// @ts-ignore
export const config: WebdriverIO.Config = {
    ...sharedConfig,
    ...{
        user: process.env.LT_USERNAME,
        key: process.env.LT_ACCESS_KEY,
        services: [
            ['lambdatest', {
                tunnel: true
            }]
        ],
        capabilities: [{
            // "platform": "Windows 10",
            // "browserName": "firefox",
            // "browserVersion": 'latest',
            // "version": "106.0",
            // "resolution": "1280x1024",
            // "selenium_version": "4.0.0",
            // "console": true,
            // "chrome.driver": "108.0"
            // "network": true,
            // "visual": true,
            // "terminal": true,
            maxInstances: 5,
            browserName: 'firefox',
            browserVersion: 'latest',
            platformName: 'Windows 10',
        }]
    }
}