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
         console.log (`Logging in with '${username}' and '${password}'`)
        await this.inputUsername.setValue(username);
         console.log (`Entered '${username}'`)
        await this.inputPassword.setValue(password);
         console.log (`Entered '${password}' and clicking Submit`)
        await this.btnSubmit.click();
         console.log ("Submit clicked!")
    }

    /**
     * overwrite specific options to adapt it to page object
     */
    public open () {
        return super.open('login');
    }
}

export default new LoginPage();
