export default class Page {
    /**
    * Opens a sub page of the page or the url provided
    * @param path path of the sub page (e.g. /path/to/page.html)
    */
    public async open(path: string) {
        if (path.startsWith(`http`)){
            return await browser.url(path); // Overwrite the path
        }

        if (path.startsWith(`components`)){
            return await browser.url(`https://www.telerik.com/kendo-react-ui/${path}`);
        }

        return await browser.url(`https://the-internet.herokuapp.com/${path}`);
    }

    public async getUrlAdv(path: string): Promise<string> {
        let thisUrl = await browser.getUrl();
        return thisUrl;
    }
}