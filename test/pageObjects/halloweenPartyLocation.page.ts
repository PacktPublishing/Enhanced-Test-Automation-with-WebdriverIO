import Page from './page';
import * as helpers from "../../helpers/helpers";
import { ASB } from '../../helpers/globalObjects';

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

    public async build() {
        let success: boolean = false; // Return false if this is not the current page.
        
        //if page contains "party-location" then click on find out more button
        if ((await ASB.get("page")).includes("party-location")) {
            // Implicitly move to the next page
            
           success = await helpers.clickAdv(await this.btnFindOutMore);
        }

        return success;
    }
}

export default new HalloweenPartyLocationPage(); 