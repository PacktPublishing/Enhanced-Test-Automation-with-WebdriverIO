import Page from './page';
import * as helpers from "../../helpers/helpers";
import { ASB } from '../../helpers/globalObjects';
import allureReporter from "@wdio/allure-reporter";

/** 
 * sub page with selectors for a specific page 
 */
class HalloweenHostPartyPage extends Page {
    /** 
     * define selectors using getter methods 
     */
    public get btnZombieton() {
        return $(`//button[contains(normalize-space(),'Zombie')]`);
    }

    public get btnGhostville() {
        return $(`//button[contains(normalize-space(),'Ghostville')]`);
    }

    public async build(testdata) {
        let success: boolean = false; // Return false if this is not the current page.
        let location = testdata.Location.toLowerCase()
        // Is this the page to process?   	 
        const path = {
            zombieton: async () => success = await helpers.clickAdv(await this.btnZombieton),
            ghostville: async () => success = await helpers.clickAdv(await this.btnGhostville),
            default: () => allureReporter.addAttachment(`Invalid location: ${location}`, "", "text/plain"),
        };

        (location)();

        return success;
    }
}

export default new HalloweenHostPartyPage(); 