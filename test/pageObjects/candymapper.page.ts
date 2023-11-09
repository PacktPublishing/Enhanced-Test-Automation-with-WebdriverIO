
import * as helpers from '../../helpers/helpers';
import { ASB } from '../../helpers/globalObjects';
import Page from "./page";

/**
 * sub page containing specific selectors and methods for a specific page
 */
class CandymapperPage extends Page {

    public get btnPopupClose() {
        return $('//*[name()="svg"][contains(@id,"close-icon")]');
    }
    // public get btnPopupClose() {
    //     return $('[class="x-el x-el-svg c1-1 c1-2 c1-el c1-1h c1-2b c1-em c1-en c1-eo c1-ep c1-1s c1-an c1-3 c1-eq c1-er c1-b c1-c c1-d c1-e c1-f c1-g"]');
    // }

    public get btnHalloweenParty() {
        return $(`//a[text()='Halloween Party']`);
    }


    public async build(testdata: string) {
        // Is this the page to process?  
     //await helpers.log ("****************  Page: " +ASB.get("page"))
        if (await ASB.get("page").includes("candymapper")) {
            // Close the popup if it exists
            if (await this.btnPopupClose.isDisplayed()) {
                await helpers.clickAdv(await this.btnPopupClose);
            }
            await helpers.clickAdv(await this.btnHalloweenParty);
        }
    }

}

export default new CandymapperPage();
