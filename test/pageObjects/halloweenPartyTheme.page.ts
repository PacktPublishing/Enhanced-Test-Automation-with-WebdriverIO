import Page from './page';
import * as helpers from "../../helpers/helpers";
import { ASB } from '../../helpers/globalObjects';
import allureReporter from "@wdio/allure-reporter";

/** 
 * sub page with selectors for a specific page 
 */
class HalloweenThemePartyPage extends Page {
    /** 
     * define selectors using getter methods 
     */
    public get btnZombies() {
        return $(`//a[contains(normalize-space(),'Zombies')]`);
    }

    public get btnGhosts() {
        return $(`//a[contains(normalize-space(),'Ghosts')]`);
    }



    public async build() {
       // let success: boolean = false; // Return false if this is not the current page.

        // Is this the page to process?
        console.log("PartyTheme: " + await ASB.get("page") )
        if (await ASB.get("page").includes("host-a-party")) {
            console.log("inside PartyTheme host-a-party: " + await ASB.get("page"))
           
            let theme = ASB.get("theme").toLowerCase()
            console.log("**************** theme '" + theme + "'")
            const path = {
                zombies: async () => await helpers.clickAdv(await this.btnZombies),
                ghosts: async () =>  await helpers.clickAdv(await this.btnGhosts),
                default: () => allureReporter.addAttachment(`Invalid theme type: ${theme}`, "", "text/plain"),
            };

            // If the location is not in the path object, use the default.
           return (path[theme]||path["default"])();
        }


       // return success;
    }
}

export default new HalloweenThemePartyPage(); 