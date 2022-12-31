"strict mode"
import LoginPage from  '../pageobjects/login.page.js';
import SecurePage from '../pageobjects/secure.page.js';
import * as helpers from '../../helpers/helpers.js';

describe('My Login application', () => {
    it('Chapter 4: Custom Log', async () => {
        helpers.log(`Hello, World!`)
        helpers.log(`PASS: You are never too old to set another goal or to dream a new dream. -- C.S. Lewis`)
        helpers.log(`FAIL: It's never too late to go back to bed.`)
        helpers.log(`WARN: Earth is mostly harmless`)
        helpers.log(``) // Does not print 
        helpers.log(null) // Does not print 
        helpers.log(Promise) // Adds trace back

    })

    fit('should login with valid credentials', async () => {
        // helpers.log(Promise) // Unit test log returns warning when anything but string is passsed
        await LoginPage.open();
        // Chapter 3
        // console.log (`Entering password`) // Intrinsic log
        // await global.log (`Entering password`) // Custom log


        await LoginPage.login('tomsmith', 'SuperSecretPassword!');
        await expect(SecurePage.flashAlert).toBeExisting();
        await expect(SecurePage.flashAlert).toHaveTextContaining(
            'You logged into a secure area!');

        // Chapter 4
        // Promise.resolve().then( _ => console.log(`2`));
        // setTimeout( _ => console.log(`3`),0);
        // console.log(`1`);
    });
});




