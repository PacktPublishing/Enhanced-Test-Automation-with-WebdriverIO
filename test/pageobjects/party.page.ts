import { ChainablePromiseElement } from "webdriverio";
import * as helpers from "../../helpers/helpers.js";
import Page from "./page.js";

/**
 * sub page containing specific selectors and methods for a specific page
 */
class halloween extends Page {
  /**
   * define selectors using getter methods
   */
  public get fldTarget() {
    return $(`//input[@type="text"]`);
  }

  /**
   * a method to encapsule automation code to interact with the page
   * e.g. to login using username and password
   */
  public async enterDateTags() {
    await helpers.setValueAdv(await this.fldTarget, 
      "today is <today>");
    await helpers.setValueAdv(await this.fldTarget,
      "next week is <today+7> and last week was <today-7>");
    await helpers.setValueAdv(await this.fldTarget, 
      "Last year is <today-300>");
  }
}
export default new KeyPressesPage();
