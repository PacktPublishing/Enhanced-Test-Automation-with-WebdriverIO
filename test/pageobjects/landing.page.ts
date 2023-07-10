
import * as helpers from "../../helpers/helpers";
import Page from "./page";

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LandingPage extends Page {
  /**
   * define selectors using getter methods
   */
  public get btnTypos() {
    return $("//a[normalize-space()='Typos']");
  }

  public get btnDynamicLoading() {
    return $("//a[normalize-space()='Dynamic Loading']");
  }

  /**
   * a method to encapsule automation code to interact with the page
   * e.g. to login using username and password
   */
  public async navToTypos() {
    await helpers.clickAdv (await this.btnTypos);
   }

  /**
   * a method to encapsule automation code to interact with the page
   * e.g. to login using username and password
   */
  public async navToDynamicLoading() {
    await helpers.clickAdv (await this.btnDynamicLoading);
   }


      
  /**
   * overwrite specific options to adapt it to page object
   */
  public open() {
    return super.open("");
  }
}

export default new LandingPage();
