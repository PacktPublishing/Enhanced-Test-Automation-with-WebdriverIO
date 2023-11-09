import Page from './page';
import * as helpers from "../../helpers/helpers";
import allureReporter from "@wdio/allure-reporter";
import { ASB } from '../../helpers/globalObjects';

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
        // let location = testdata.Location.toLowerCase()
        let location = testdata.toLowerCase()
        // Is this the page to process?
        if (await ASB.get("page") === "attend-a-party") {
        const path = {
            zombieton: async () => success = await helpers.clickAdv(await this.btnZombieton),
            ghostville: async () => success = await helpers.clickAdv(await this.btnGhostville),
            default: () => allureReporter.addAttachment(`Invalid location: ${location}`, "", "text/plain"),
        };

        (path[location]||path["default"])();
    }

        return success;
    }
}

export default new HalloweenHostPartyPage(); 