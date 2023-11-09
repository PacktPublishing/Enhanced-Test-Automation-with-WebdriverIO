
import * as helpers from '../../helpers/helpers';
import { ASB } from '../../helpers/globalObjects';
import Page from "./page";

/**
 * sub page containing specific selectors and methods for a specific page
 */
class CandymapperPage extends Page {

    // public btnPopupClose() {
    public get btnPopupClose() {
        return $(`//*[name()="svg"][contains(@id,"close-icon")]`);
    }

    public get btnHalloweenParty() {
        return $(`//a[text()='Halloween Party']`);
    }


    public async build() {
        // Is this the page to process?  
        let success = false;
        if (await ASB.get("page").toLowerCase().includes("candymapper")) {
            // Close the popup if it exists

            if (await (await this.btnPopupClose).isDisplayed()) {

                await helpers.clickAdv(await this.btnPopupClose);

            }
            await helpers.clickAdv(await this.btnHalloweenParty);
            success = true;
        }
        return success;
    }

}

export default new CandymapperPage();
