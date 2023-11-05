import Page from './page.js';
import * as helpers from "../../helpers/helpers.js";
import { ASB } from '../../helpers/globalObjects.js';
import allureReporter from "@wdio/allure-reporter";

/** 
 * sub page with selectors for a specific page 
 */
class HalloweenPartyLocationPage extends Page {
    /** 
     * define selectors using getter methods 
     */
    public get btnFindOutMore() {
        return $(`//button[contains(normalize-space(),'Find Out More')]`);
    }

    public get listAdditionalGuests() {
        return $(`#guests`); // This is a list inside an iFrameof additional 1 or 2 guests
    }

    public async build(testdata) {
        let success: boolean = false; // Return false if this is not the current page.
        if (await ASB.get("page") === "party-location") {
            let location = testdata.Location.toLowerCase()
            // Is this the page to process?   	 
            const path = {
                zombieton: async () => success = await helpers.clickAdv(await this.btnZombieton),
                ghostville: async () => success = await helpers.clickAdv(await this.btnGhostville),
                default: () => allureReporter.addAttachment(`Invalid location: ${location}`, "", "text/plain"),
            };
            
            path[location]();
        }

        return success;
    }
}

export default new HalloweenPartyLocationPage(); 