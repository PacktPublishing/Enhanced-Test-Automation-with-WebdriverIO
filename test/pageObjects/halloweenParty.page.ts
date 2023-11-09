import Page from './page';
import * as helpers from "../../helpers/helpers";
import { ASB } from '../../helpers/globalObjects';
import { Console } from 'console';

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

    public async build() {

        //let success: boolean = false; // Return false if this is not the current page.

        // Is this the page to process?   
        
        console.log("HalloweenPartyPage: " + await ASB.get("page") + " AttendOrHost:" + await ASB.get("hostOrAttend"))

        if (await ASB.get("page") === "halloween-party") {
            console.log("inside HalloweenPartyPage: " + await ASB.get("page") )
            // Host or attend the party based on the ASB
        
            
            if (ASB.get("hostOrAttend").toLowerCase() === `attend`) {
                return await helpers.clickAdv(await this.attendParty); 4
            }

            //Default to host
            return await helpers.clickAdv(await this.hostParty);
        }

        //This was not the page to process
        return false;

    }
}
export default new HalloweenPartyPage(); 
