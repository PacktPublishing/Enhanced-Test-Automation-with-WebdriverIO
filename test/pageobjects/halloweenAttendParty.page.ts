import Page from './page.js';
import * as helpers from "../../helpers/helpers.js";
import { ASB } from '../../helpers/globalObjects.js';
import allureReporter from "@wdio/allure-reporter";

/** 
 * sub page with selectors for a specific page 
 */
class HalloweenAttendPartyPage extends Page {
    /** 
     * define selectors using getter methods 
     */
    public get btnZombieton() {
        return $(`//button[contains(normalize-space(),'Zombieton')]`);
    }

    public get btnGhostville() {
        return $(`//button[contains(normalize-space(),'Ghostville')]`);
    }

    public get btnScared() {
        return $(`//button[contains(normalize-space(),'Back')]`);
    }

    public async build(testdata) {
        let success: boolean = false; // Return false if this is not the current page.
        let location = testdata.Location.toLowerCase()
        // Is this the page to process?   	 
        const path = {
            zombieton: async () => success = await helpers.clickAdv(await this.btnZombieton),
            ghostville: async () => success = await helpers.clickAdv(await this.btnGhostville),
            scared: async () => success = await helpers.clickAdv(await this.btnScared),
            default: () => allureReporter.addAttachment(`Invalid location type: ${location}`, "", "text/plain"),
        };

        // If the location is not in the path object, use the default.
        path[location]();

        return success;
    }
}

export default new HalloweenAttendPartyPage(); 