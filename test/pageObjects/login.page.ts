import Page from './page';
import * as helpers from '../../helpers/helpers';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class loginPage extends Page {
    /**
     * define selectors using getter methods
     */
    public get inputUsername() {
        return $('#username');
    }

    public get inputPassword() {
        return $('#password');
    }

    public get btnSubmit() {
        return $('button[type="submit"]');
    }

    public get btnBogus() {
        return $('//button[type="bogus"]');
    }

    public get lnkSubmit() {
        return $('//a[text()="submit"]');
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
        await this.btnSubmit.click();
    }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     * missing await so the click executes before the setValue
     */
    public async login_sync(username: string, password: string) {
        global.log(`Logging in with '${username}' and '${password}'`)
        this.inputUsername.setValue(username);
        this.inputPassword.setValue(password);
        this.btnSubmit.click();
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

        // This button does not exist - failing the test
        let selector = await this.btnBogus.selector;
        await helpers.log(`${selector}`)
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
      * Opens a sub page of the page or the url provided
      * @param path optional path of the sub page (e.g. /path/to/page.html)
      */
    // public open(): Promise<void>;
    // public open(path: string): Promise<void>;
    // public open(path?: string): Promise<void> {
    //     if (typeof path !== 'undefined' && typeof path === 'string') {
    //         return super.open(path);
    //     } else {
    //         return super.open();
    //     }
    // }

    public open(path: string = "login" ) {
        return super.open(path);
    }

}

export default new loginPage();
