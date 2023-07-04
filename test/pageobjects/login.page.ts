import { ChainablePromiseElement } from "webdriverio";
import * as helpers from "../../helpers/helpers.js";
import Page from "./page.js";

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
  /**
   * define selectors using getter methods
   */
  public get inputUsername() {
    return $("#username");
  }

  public get inputPassword() {
    return $("#password");
  }

  public get btnSubmit() {
    return $('button[type="submit"]');
  }

  public get lnkSubmit() {
    return $('//a[text()="submit"]');
  }
    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    public async login (username: string, password: string) {
        await global.log(`Logging in with '${username}' and '${password}'`)
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.btnSubmit.click();
    }

  public get btnBogus() {
    return $('//button[type="bogus"]');
  }

  /**
   * a method to encapsule automation code to interact with the page
   * e.g. to login using username and password
   */
  public async login(username: string, password: string) {
    await helpers.log(`Logging in with '${username}' and '${password}'`);
    await this.inputUsername.setValue(username);
    await helpers.log(`Entered '${username}'`);
    await this.inputPassword.setValue(password);
    await helpers.log(
      `Entered '${password}' and clicking Submit with ClickAdv`
    );
    // @ts-ignore
    await this.btnSubmit.click();
  }

  /**
   * a method to unit test the failure of an button that does not exist
   * e.g. to login using username and password
   */
  public async loginFailLast(username: string, password: string) {
    await helpers.log(`Logging in with '${username}' and '${password}'`);
    await this.inputUsername.setValue(username);
    await helpers.log(`Entered '${username}'`);
    await this.inputPassword.setValue(password);
    await helpers.log(
      `Entered '${password}' and clicking Submit with ClickAdv`
    );

    await helpers.clickAdv(this.btnSubmit);
    await helpers.clickAdv(this.btnBogus);
  }

  /**
   * a method to unit test the failure of an button that does not exist
   * e.g. to login using username and password
   */
  public async loginOld(username: string, password: string) {
    await helpers.log(`Logging in with '${username}' and '${password}'`);
    await this.inputUsername.setValue(username);
    await helpers.log(`Entered '${username}'`);
    await this.inputPassword.setValue(password);
    await helpers.log(
      `Entered '${password}' and clicking Submit with ClickAdv`
    );
    // Class switching
    await helpers.clickAdv(this.lnkSubmit);
  }

  /**
   * a method to unit test the failure of an button that does not exist
   * e.g. to login using username and password
   */
  public async loginFailFirst(username: string, password: string) {
    await helpers.log(`Logging in with '${username}' and '${password}'`);
    await this.inputUsername.setValue(username);
    await helpers.log(`Entered '${username}'`);
    await this.inputPassword.setValue(password);
    await helpers.log(
      `Entered '${password}' and clicking Submit with ClickAdv`
    );
    await helpers.clickAdv(this.btnBogus);
    await helpers.clickAdv(this.btnSubmit);
  }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     * missing await so the click executes before the setValue
     */
        public async login_sync (username: string, password: string) {
             global.log(`Logging in with '${username}' and '${password}'`)
             this.inputUsername.setValue(username);
             this.inputPassword.setValue(password);
             this.btnSubmit.click();
        }

    /**
     * overwrite specific options to adapt it to page object
     */
    public async open () {
        return await super.open('login');
    }
}

export default new LoginPage();
