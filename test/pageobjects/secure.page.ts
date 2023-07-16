// import { ChainablePromiseElement } from 'webdriverio';
import {browser, $} from '@wdio/globals';
import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class SecurePage extends Page {
    /**
     * define selectors using getter methods
     */
    public get flashAlert () {
        global.log(`Getting flashalert`)
        return $('#flash');
    }
}

export default new SecurePage();
