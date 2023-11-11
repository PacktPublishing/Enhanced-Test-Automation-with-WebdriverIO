import LoginPage from '../pageobjects/login.page';
import SecurePage from '../pageobjects/secure.page';

describe("Ch4: Super Speed : Time Travel Paradoxes and Broken Promises", () => {
    it('should report text in order 1,2,3 even though the code is in 2, 3, 1 order', () => {
        // Microtasks, Macrotasks and Main thread execute out of order
        Promise.resolve().then(_ => console.log(`2: Promise Microtask - First line of code executes second!`)); //Microtask
        setTimeout(_ => console.log(`3: SetTimeout Macrotask - Second Line of code executes third!`), 0); // Macrotask
        console.log(`1: Main Thread - Third Line of Code executes first!`); // Main thread
        expect(true).toBeTruthy();
    });
})

describe("Ch4: Super Speed : Login with Await", () => {
    it('Should PASS to login because await statements exist to ensure code executes in sequence', async () => {
        await LoginPage.open();

        await LoginPage.login("tomsmith", "SuperSecretPassword!");
        await expect(SecurePage.flashAlert).toBeExisting();
        await expect(SecurePage.flashAlert).toHaveTextContaining(
            "You logged into a secure area!"
        );
    });
})

describe("Ch4: Super Speed : Login fails without await", () => {
    it('Should FAIL to login because await statements are missing in login_sync and executes out of order', async () => {
        global.log(`1. Open browser without await`);
        await LoginPage.open();
        // Removed await keywords - Demonstrates potential "Time Travel" issue when .click executes before .setValue in login_sync
        await LoginPage.login_sync('tomsmith1', 'SuperSecretPassword!');
        await expect(SecurePage.flashAlert).toBeExisting();
        await expect(SecurePage.flashAlert).toHaveTextContaining(
            'You logged into a secure area!');
    })
})