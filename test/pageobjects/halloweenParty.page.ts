import Page from './page.js';
import * as helpers from "../../helpers/helpers.js";
import { ASB } from '../../helpers/globalObjects.js';

/** 
 * sub page with selectors for a specific page 
 */
class HalloweenPartyPage extends Page {
    /** 
     * define selectors using getter methods 
     */
    public get hostParty() {
        return $(`//a[contains(normalize-space(),'ost')]`);
    }

    public get attendParty() {
        return $(`//a[contains(normalize-space(),'ttend')]`);
    }

    public async build(testdata:string) {

        let success: boolean = false; // Return false if this is not the current page.

        // Is this the page to process?   	 
        if (await ASB.get("page") === "halloween-party") {

            // Host or attend the party based on the ASB
            if (await ASB.get("hostOrAttend").toLowerCase() === `attend`) {
                success = await helpers.clickAdv(await this.attendParty);
            } else {
                //Default to host
                success = await helpers.clickAdv(await this.hostParty);
            }
        }

        return success;

    }
}
export default new HalloweenPartyPage(); 
