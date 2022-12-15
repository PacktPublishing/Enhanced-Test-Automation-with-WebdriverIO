"strict mode"
import LoginPage from  '../pageobjects/login.page.js';
import SecurePage from '../pageobjects/secure.page.js';


describe('My Login application', () => {
    it('should login with valid credentials', async () => {
        await LoginPage.open();
        // Chapter 3
        // console.log (`Entering password`) // Intrinsic log
        // await global.log (`Entering password`) // Custom log
        // await global.log (``) // Does not print 
        // await global.log (null) // Does not print 
        // await global.log (Promise) // Adds trace back

        await LoginPage.login('tomsmith', 'SuperSecretPassword!');
        await expect(SecurePage.flashAlert).toBeExisting();
        await expect(SecurePage.flashAlert).toHaveTextContaining(
            'You logged into a secure area!');
    });
});




