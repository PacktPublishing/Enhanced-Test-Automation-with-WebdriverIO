import { config as sharedConfig } from './wdio.shared.conf'

export const config = {
    ...sharedConfig,
    ...{
        capabilities: [
            {
                browserName: 'chrome'
            },
            {
                browserName: 'safari'
            }
        ]
    }
}