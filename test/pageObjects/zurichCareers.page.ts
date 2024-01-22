import * as helpers from '../../helpers/helpers';
import { ASB } from '../../helpers/globalObjects';
import Page from "./page";

/**
 * sub page containing specific selectors and methods for a specific page
 */
class ZurichCareersPage extends Page {
    public get btnSearchJobs() {
        return $(`//span[@class='field-buttontext']`);
    }

    public get fldLookingFor() {
        return $(`//input[@placeholder='I am looking for']`);
    }

    public get lnkMyNextJob() {
        return $(`//*[contains(@class,'visible')]/span[contains(normalize-space(), 
        'Project Test and Quality Manager')]`);
    }

    public async build() {
        // Is this the page to process?  
        let success = false;
        console.log("candymapper Main: " + await ASB.get("page") )
        if (await ASB.get("page") === "") {
            // Close the popup if it exists
            console.log(" inside candymapper Main: " + await ASB.get("page") )

            if (await (await this.btnPopupClose).isDisplayed()) {
                await helpers.clickAdv(await this.btnPopupClose);
            }
            await helpers.clickAdv(await super.btnHalloweenParty);
            success = true;
        }
        return success;
    }
}

export default new ZurichCareersPage();
