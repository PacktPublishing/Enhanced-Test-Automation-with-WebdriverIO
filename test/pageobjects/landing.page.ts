import { ChainablePromiseElement } from "webdriverio";
import * as helpers from "../../helpers/helpers.js";
import Page from "./page.js";

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


  /**
   * a method to encapsule automation code to interact with the page
   * e.g. to login using username and password
   */
  public async navToTypos() {
    await helpers.clickAdv (this.btnTypos);
   }

  /**
   * a method to unit test the failure of an button that does not exist
   * e.g. to login using username and password
   */
  public async loginFailLast(username: string, password: string) {
    helpers.log(`Logging in with '${username}' and '${password}'`);
    await this.inputUsername.setValue(username);
    helpers.log(`Entered '${username}'`);
    await this.inputPassword.setValue(password);
    helpers.log(`Entered '${password}' and clicking Submit with ClickAdv`);
    
    await helpers.clickAdv(this.btnSubmit);
    await helpers.clickAdv(this.btnBogus);
  }


    /**
   * a method to unit test the failure of an button that does not exist
   * e.g. to login using username and password
   */
    public async loginFailFirst(username: string, password: string) {
        helpers.log(`Logging in with '${username}' and '${password}'`);
        await this.inputUsername.setValue(username);
        helpers.log(`Entered '${username}'`);
        await this.inputPassword.setValue(password);
        helpers.log(`Entered '${password}' and clicking Submit with ClickAdv`);
        await helpers.clickAdv(this.btnBogus);        
        await helpers.clickAdv(this.btnSubmit);

      }


      
  /**
   * overwrite specific options to adapt it to page object
   */
  public open() {
    return super.open("");
  }
}

export default new LandingPage();
