import LoginPage from  '../pageobjects/login.page';
import SecurePage from '../pageobjects/secure.page';


describe('My Login application', () => {
    it('should login with valid credentials', async () => {
        await LoginPage.open();
        console.log (`Entering password`)
        global.log (`Entering password`)

        await global.log (``)
        await global.log (null)
        await global.log (Promise)
        global.log (Promise)

        await LoginPage.login('tomsmith', 'SuperSecretPassword!');
        await expect(SecurePage.flashAlert).toBeExisting();
        await expect(SecurePage.flashAlert).toHaveTextContaining(
            'You logged into a secure area!');
    });
});




