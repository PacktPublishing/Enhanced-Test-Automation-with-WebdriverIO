
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class TyposPage extends Page {
    /**
     * define selectors using getter methods
     */
    public get typoText () {
        return $(`//p[contains(text(),'random')]`);
    }
}

export default new TyposPage();
