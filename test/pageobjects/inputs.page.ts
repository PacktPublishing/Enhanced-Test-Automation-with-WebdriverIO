import { ChainablePromiseElement } from "webdriverio";
import * as helpers from "../../helpers/helpers";
import Page from "./page";

/**
 * sub page containing specific selectors and methods for a specific page
 */
class KeyPressesPage extends Page {
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
    helpers.pause(2000);

    await helpers.setValueAdv(await this.fldTarget,
      "next week is <today+7> and last week was <today-7>");
      helpers.pause(2000);

      await helpers.setValueAdv(await this.fldTarget, 
      "Last year is <today-300>");
      helpers.pause(2000);

  }
}
export default new KeyPressesPage();
