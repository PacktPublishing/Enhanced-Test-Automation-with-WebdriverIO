import { ChainablePromiseElement } from "webdriverio";
import * as helpers from "../../helpers/helpers";
import Page from "./page";

/**
 * sub page containing specific selectors and methods for a specific page
 */
class DynamicLoadingPage extends Page {
  /**
   * define selectors using getter methods
   */

  public get btnHiddenElement() {
    return $(`//a[contains(text(),'hidden')]`);
  }

  public get btnStart() {
    return $(`//button[normalize-space()='Start']`);
  }

  public get txtHelloWorld() {
    return $(`//h4[contains(text(),'Hello World')]`);
  }
  /**

verifyHelloWorld();
  /**
   * a method to encapsule automation code to interact with the page
   * e.g. to login using username and password
   */
  public async navToSpinner() {
    await helpers.clickAdv(await this.btnHiddenElement);
    await helpers.clickAdv(await this.btnStart);
  }
  /**
   * overwrite specific options to adapt it to page object
   */
  public open() {
    return super.open("dynamic_loading");
  }
}

export default new DynamicLoadingPage();
