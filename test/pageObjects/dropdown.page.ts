import * as helpers from "../../helpers/helpers";
import Page from "./page";

/**
 * sub page containing specific selectors and methods for a specific page
 */
class DropdownPage extends Page {
    /**
     * define selectors using getter methods
     */
    public get listOptions() {
        return $("#username");
    }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    public async selectOption(option: string) {
        await helpers.log(`Selecting option "${option}"`);
        await helpers.selectAdv(await this.listOptions, option);
    }

    /* a method to encapsule automation code to interact with the page
    * e.g. to login using username and password
    */
   public async selectOptionWithoutPom(option: string) {
       await helpers.log(`Selecting option "${option}"`);
       await helpers.selectAdv(`dropdown`, option);
   }

}
export default new DropdownPage();