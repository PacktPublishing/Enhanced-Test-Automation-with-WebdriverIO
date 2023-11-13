// import {browser} from '@wdio/globals';
/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
import allureReporter from '@wdio/allure-reporter';
import { baseUrl } from '../../wdio.shared.conf';
export default class Page {
    /**
    * Opens a sub page of the page
    * @param path path of the sub page (e.g. /path/to/page.html)
    */
    public async open (path: string) {
        allureReporter.addAttachment('Navigating to url', path, 'string');
        //global.log(`Opening browser to https://the-internet.herokuapp.com/${path}`)
        // return await browser.url(`https://the-internet.herokuapp.com/${path}`)
        
        const message = `Opening URL: ${baseUrl}/${path}`;
        const line = '-'.repeat(message.length);
        
        global.log(line);
        global.log(message);
        global.log(line);
        
        return await browser.url(`/${path}`)
    }

    public async getUrlAdv (path: string) {
        let thisUrl = await browser.getUrl();
    }

}
