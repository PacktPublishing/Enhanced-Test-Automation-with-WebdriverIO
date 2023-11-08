/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
export default class Page {
    /**
     * Opens a sub page of the page or the url provided
     * @param path optional path of the sub page (e.g. /path/to/page.html)
     */
    public async open(path?: string | undefined) {
        if (typeof path !== 'undefined' && typeof path === 'string') {
            if (path.startsWith(`http`)) {
                await browser.url(path); // Overwrite the path
            } else if (path.startsWith(`components`)) {
                await browser.url(`https://www.telerik.com/kendo-react-ui/${path}`);
            } else {
                await browser.url(`${browser.options.baseUrl}/${path}`);
            }
        } else {
            // Use the default path passed in from Env=prod or Jenkins
            await browser.url(`${browser.options.baseUrl}`);
        }

        console.log(await browser.getUrl());
    }
}