import Page from './page';
import * as helpers from "../../helpers/helpers";
import { ASB } from '../../helpers/globalObjects';
import allureReporter from "@wdio/allure-reporter";

/** 
 * sub page with selectors for a specific page 
 */
class HalloweenAttendPartyPage extends Page {
    /** 
     * define selectors using getter methods 
     */
    public get btnZombieton() {
        return $(`//a[contains(normalize-space(),'Zombieton')]`);
    }

    public get btnGhostville() {
        return $(`//a[contains(normalize-space(),'Ghostville')]`);
    }

    public get btnScared() {
        return $(`//a[contains(normalize-space(),'Back')]`);
    }

    public async build() {
        
        // Is this th""e page to process?
        console.log("AttendPartyPage: " + await ASB.get("page") )
        
        if (await ASB.get("page").includes("attend-a-party")) {
            let location = ASB.get("location")

            const path = {
                ghostville: async () =>  await helpers.clickAdv(await this.btnGhostville),
                scared: async () =>  await helpers.clickAdv(await this.btnScared),
                zombieton: async () =>  await helpers.clickAdv(await this.btnZombieton),
                default: () => allureReporter.addAttachment(`Invalid location type: ${location}`, "", "text/plain"),
            };

            // If the location is not in the path object, use the default.
            return (path[location]||path["default"])();
        }
        return false; //This is not the page to process
    }
}

export default new HalloweenAttendPartyPage(); 