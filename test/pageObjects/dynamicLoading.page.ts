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

  public get btnRenderedElement() {
    return $(`//a[contains(text(),'rendered')]`);
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
  public async clickStartWithHiddenElementAndSpinner() {
    // Click Start button that navigates to page with hidden "Hello world" element and spinner 
    await helpers.clickAdv(await this.btnHiddenElement);

    // clickAdv waits for the dynamically waits for spinner to disappear
    // It highlights the spinner while it is waiting.
    await helpers.clickAdv(await this.btnStart);
  
  }

  /**
   * a method to encapsule automation code to interact with the page
   * e.g. to login using username and password
   */
  public async clickStartWithRenderedElementAndSpinner() {
    // Click Start button that navigates to page with "Hello world" element rendered after spinner    
    await helpers.clickAdv(await this.btnRenderedElement);

    // clickAdv waits for the to disappear before rendering "Hello World" on the page.
    // It highlights the spinner while it is waiting.
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
