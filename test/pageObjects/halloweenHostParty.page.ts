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
        return $(`//a[contains(normalize-space(),'Zombie')]`);
    }

    public get btnGhostville() {
        return $(`//a[contains(normalize-space(),'Ghostville')]`);
    }

    public async build() {
        console.log("HostPartyPage: " + await ASB.get("page") )

        // Is this the page to process?
        if (await ASB.get("page") === "party-location") {
            console.log("inside HostPartyPage party-location: " + await ASB.get("page"))

            let location = ASB.get("location").toLowerCase()
            const path = {
            zombieton: async () => await helpers.clickAdv(await this.btnZombieton),
            ghostville: async () =>  await helpers.clickAdv(await this.btnGhostville),
            default: () => allureReporter.addAttachment(`Invalid location: ${location}`, "", "text/plain"),
        };

        return (path[location]||path["default"])();
    }

        return false; //This is not the page to process
    }
}

export default new HalloweenHostPartyPage(); 