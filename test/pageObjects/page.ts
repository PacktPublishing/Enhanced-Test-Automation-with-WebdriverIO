// import {browser} from '@wdio/globals';
/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/

export default class Page {
    /**
    * Opens a sub page of the page
    * @param path path of the sub page (e.g. /path/to/page.html)
    */
    public async open (path: string) {
        global.log(`Opening browser to https://the-internet.herokuapp.com/${path}`)
        // return await browser.url(`https://the-internet.herokuapp.com/${path}`)
        return await browser.url(`/${path}`)
    }

    public async getUrlAdv (path: string) {
        let thisUrl = await browser.getUrl();
    }

}
