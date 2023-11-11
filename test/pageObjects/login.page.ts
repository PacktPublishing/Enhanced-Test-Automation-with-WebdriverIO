import * as helpers from "../../helpers/helpers";
import Page from "./page";

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

    await helpers.clickAdv(await this.btnSubmit);
    await helpers.clickAdv(await this.btnBogus);
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
    await helpers.clickAdv(await this.lnkSubmit);
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
    await helpers.clickAdv(await this.btnBogus);
    await helpers.clickAdv(await this.btnSubmit);
  }

  /**
   * a method to unit test the failure of an button that does not exist
   * e.g. to login using username and password
   */
  public async loginSetValue(username: string, password: string) {
    await helpers.log(`Logging in with user role '${username}'`);
    await helpers.setValueAdv(await this.inputUsername, username);
    // Automatcally Mask the Password
    await helpers.setValueAdv(await this.inputPassword, password); 
    await helpers.clickAdv(await this.btnSubmit);
  }

  /**
   * overwrite specific options to adapt it to page object
   */
  public open(path: string = "login") {
    return super.open(path);
  }
}

export default new LoginPage();
