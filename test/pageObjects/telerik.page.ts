import Page from './page';
import * as helpers from '../../helpers/helpers';
/**
 * sub page containing specific selectors and methods for a specific page
 */
class TelerikPage extends Page {
    /**
     * define selectors using getter methods
     */
    public get lstCountriesByAncestor() {
        return $(`//input/ancestor::div[text()='Find restaurants in your country']`);
    }

    public get lstCountriesByAxis() {
        return $(`//div[text()="Find restaurants in your country"]//following::input`);
    }

    public get lstCountriesByCloseMatch() {
        return $(`//div[contains(text(),'restaurant')]//following::input`);
    }

    public get lstCountriesCaseInsensitive() {
        return $(`//div[translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') = "Find restaurants in your country"]//following::input`);
    }

    public get lstCountriesVisible() {
        return $(`//div[translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') = "Find restaurants in your country"]//following::input`);
    }

    public get lstCountriesByBogus() {
        return $(`//select[@id='find_restaurants']`);
    }

    public get itmCountry() {
        return $(`//input/ancestor::div[1]`);
    }

    public get buttonAcceptCookies() {
        return $(`[id='onetrust-accept-btn-handler']`);
    }

    public get comboboxSports() {
        return $(`//input[@id='sport']`);
    }

    public get comboboxCountries() {
        return $(`[class='k-input-inner']`);
    }

    public async open(path: string) {
        return await super.open(`${path}`);
    }

    /**
      * a method to encapsule automation code to interact with the page
      * e.g. to login using username and password
      */
    public async selectSport(sport: string) {
        await helpers.clickAdvIfExists(await this.buttonAcceptCookies);
        // Telerik has a scroll down to get to the element
        await helpers.scrollDown();
        const iframe = await browser.findElement('css selector', 'iframe');
        await browser.switchToFrame(iframe);
        await helpers.selectAdv(await this.comboboxSports, sport);
    }

    public async selectCountry(country: string) {
        await helpers.clickAdvIfExists(await this.buttonAcceptCookies);
        // This gets you into the iFrame
        const iframe = await browser.findElement('css selector', 'iframe');
        await browser.switchToFrame(iframe);
        await helpers.selectAdv(await this.comboboxCountries, country);
    }

    public async findRestaurantsIn
        (country: string = 'Hungary') {
        //span[normalize-space()='Belgium']
        await helpers.selectAdv(await this.lstCountriesByAxis, country)
    }
}

export default new TelerikPage();