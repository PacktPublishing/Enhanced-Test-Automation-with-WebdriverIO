import allureReporter from '@wdio/allure-reporter';
import { baseUrl } from '../../wdio.shared.conf';

// export default class Page {
//     /**
//     * Opens a sub page of the page
//     * @param path path of the sub page (e.g. /path/to/page.html)
//     */
//     public async open (path: string) {
//         allureReporter.addAttachment('Navigating to url', path, 'string');
//         //global.log(`Opening browser to https://the-internet.herokuapp.com/${path}`)
//         // return await browser.url(`https://the-internet.herokuapp.com/${path}`)
//
//         const message = `Opening URL: ${baseUrl}/${path}`;
//         const line = '-'.repeat(message.length);
//
//         global.log(line);
//         global.log(message);
//         global.log(line);
//
//         return await browser.url(`/${path}`)
//     }
    //
    // public async getUrlAdv (path: string) {
    //     let thisUrl = await browser.getUrl();
    // }
// }
/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 */
export default class Page {

    public get btnHalloweenParty() {
        return $(`//a[text()='Halloween Party']`);
    }

    /**
     * Opens a sub page of the page or the url provided
     * @param path optional path of the sub page (e.g. /path/to/page.html)
     */
    public async open(path: string ) {
        allureReporter.addAttachment('Navigating to url', path, 'string');

        if (path.startsWith(`http`)) {
            await browser.url(path); // Overwrite the path
        } else if (path.startsWith(`components`)) {
            await browser.url(`https://www.telerik.com/kendo-react-ui/${path}`);
        } else if (path === ``){ //uses baseUrl from wdio.shared.conf.ts
            await browser.url(`${browser.options.baseUrl}`);
        }else {
            // return browser.url(`https://the-internet.herokuapp.com/${path}`);
            return browser.url(`${baseUrl}/${path}`);
        }

        let message: string = '';
        if (path.startsWith(`components`)) {
            // const message = `Opening URL: ${baseUrl}/${path}`;
            message = `Opening URL: https://www.telerik.com/kendo-react-ui/${path}`;
        }
        else {
            message = `Opening URL: ${baseUrl}/${path}`;
        }
            const line = '-'.repeat(message.length);

            global.log(line);
            global.log(message);
            global.log(line);
    }
}
