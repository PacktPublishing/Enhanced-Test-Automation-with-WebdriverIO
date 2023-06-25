import LoginPage from '../pageobjects/login.page';
import SecurePage from '../pageobjects/secure.page';

describe("Ch4: Super Speed – Time Travel Paradoxes and Broken Promises", () => {
    it('should report text in order 1,2,3', async () => {
        // Microtasks, Macrotasks and Main thread
        Promise.resolve().then(_ => console.log(`2: Promise Microtask - First line of code executes second!`)); //Microtask
        setTimeout(_ => console.log(`3: SetTimeout Macrotask - Second Line of code executes third!`), 0); // Macrotask
        console.log(`1: Main Thread - Third Line of Code executes first!`); // Main thread
        await expect(true).toBeTruthy();
    });

    it('Should fail to login because await statements are missing', async () => {
        await LoginPage.open();
        // Removed await keywords - Time Travel 
        LoginPage.login('tomsmith1', 'SuperSecretPassword!');
        expect(SecurePage.flashAlert).toBeExisting();
        expect(SecurePage.flashAlert).toHaveTextContaining(
            'You logged into a secure area!');
    });

});


