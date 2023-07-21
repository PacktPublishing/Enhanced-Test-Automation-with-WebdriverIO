import { config as sharedConfig } from './wdio.shared.conf';

export const config = {
    ...sharedConfig,
    ...{
        services: [
            ["lambdatest",
                {
                    tunnel: false,
                    lambdatestOpts: {
                        logFile: "tunnel.log"
                    }
                }
            ]
        ],
        user: process.env.LT_USERNAME,
        key: process.env.LT_ACCESS_KEY,

        capabilities: [
            {
                "LT:Options": {
                    browserName: "firefox",
                    version: "latest",
                    name: "Test WebdriverIO Single",
                    build: "WebDriver Selenium Sample"
                }
            }
        ],
        logLevel: "info",
        coloredLogs: true,
        screenshotPath: "./errorShots/",
        waitforTimeout: 100000,
        connectionRetryTimeout: 90000,
        connectionRetryCount: 1,
        path: "/wd/hub",
        hostname: process.env.LT_HOST_URL,
        port: 80,
        framework: "jasmine"
    }
}
