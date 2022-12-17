import { ChainablePromiseElement } from 'webdriverio';

import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
    /**
     * define selectors using getter methods
     */
    public get inputUsername () {
        return $('#username');
    }

    public get inputPassword () {
        return $('#password');
    }

    public get btnSubmit () {
        return $('button[type="submit"]');
    }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    public async login (username: string, password: string) {
        
        console.log ("Write to Console window")
        
        //Removed await keyword
        await global.log (`Logging in with '${username}' and '${password}'`)
        await this.inputUsername.setValue(username);
        await global.log (`Entered '${username}'`)
        await this.inputPassword.setValue(password);
        await global.log (`Entered '${password}' and clicking Submit`)
        await this.btnSubmit.clickAdv();
        await global.log ("Submit clicked!")
    }

    /**
     * overwrite specific options to adapt it to page object
     */
    public open () {
        return super.open('login');
    }
}

export default new LoginPage();
