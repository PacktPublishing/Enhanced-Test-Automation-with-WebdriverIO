import Page from './page.js';
import * as helpers from "../../helpers/helpers.js";
import { ASB } from '../../helpers/globalObjects';

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
            if (testdata.HostOrAttend.toLowerCase() === `host`) {
                success = await helpers.clickAdv(await this.hostParty);
            } else {
                //Default to attend
                success = await helpers.clickAdv(await this.attendParty);
            }
        }

        return success;

    }
}
export default new HalloweenPartyPage(); 
