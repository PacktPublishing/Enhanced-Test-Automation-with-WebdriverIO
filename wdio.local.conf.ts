import { config as sharedConfig } from './wdio.shared.conf'

export const config: WebdriverIO.Config = {
    ...sharedConfig,
    ...{
        capabilities: [
            {
                browserName: 'chrome',
                'goog:chromeOptions': {
                    args: ['--disable-gpu', '--enable-automation', '--disable-infobars', '--disable-notifications'] },
                acceptInsecureCerts: true,
            },
            {
                browserName: 'firefox'
            }
        ]
    }
}

