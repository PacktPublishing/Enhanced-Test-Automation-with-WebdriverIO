import Page from './page';
import { ASB } from '../../helpers/globalObjects';
import allureReporter from "@wdio/allure-reporter";

/** 
 * sub page with selectors for a specific page 
 */
class HalloweenPartyTimerPage extends Page {
    /** 
     * define selectors using getter methods 
     */

    public async build() {
        let success: boolean = false; // Return false if this is not the current page.
        console.log("HalloweenPartyTimerPage: " + await ASB.get("page") )

        // Is this the page to process?   	 
        if (await ASB.get("page") === "party-time") {
            console.log("Inside HalloweenPartyTimerPage: " + await ASB.get("page") )
        
            // End of path reached!
            allureReporter.addAttachment(`Party Timer Page reached - Path Complete`, "", "text/plain");
            success = true;
        }
        return success;
    }
}
export default new HalloweenPartyTimerPage(); 
