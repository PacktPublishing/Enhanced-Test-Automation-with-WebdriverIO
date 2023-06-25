<<<<<<< HEAD
"strict mode";
import LoginPage from "../pageobjects/login.page.js";
import SecurePage from "../pageobjects/secure.page.js";
import LandingPage from "../pageobjects/landing.page.js";
import * as helpers from "../../helpers/helpers.js";
import dynamicLoadingPage from "../pageobjects/dynamicLoading.page.js";
import { expect as expectWebdriverIO } from 'expect-webdriverio';

describe("My Login application", () => {
  it("Chapter 3:Cybernetic Enhancements Custom Logging", async () => {
    // Chapter 3
    console.log(`Hello, World!`); // Intrinsic log
    await helpers.log(`Hello, World!`); // Custom log
    await helpers.sleep(1000); // Wait 1 sec
    await helpers.log(`DONE!`); // Custom log
  });

  it("Chapter 4: Super Speed - Time Travel Paradoxes and Broken Promises", async () => {
    await helpers.log(`Hello, World!`);
    await helpers.log(
      `PASS: You are never too old to set another goal or to dream a new dream. -- C.S. Lewis`
    );
    await helpers.log(`FAIL: It's never too late to go back to bed.`);
    await helpers.log(`WARN: Earth is mostly harmless`);
    await helpers.log(``); // Does not print
    await helpers.log(null); // Does not print
    await helpers.log(Promise); // Adds trace back

    // Promise.resolve().then( _ => console.log(`2`));
    // setTimeout( _ => console.log(`3`),0);
    // console.log(`1`);
  });

  fit("Chapter 5: Fail Last clickAdv with pageSync and autoscroll", async () => {
    // await helpers.log(Promise) // Unit test log returns warning when anything but string is passsed
    await LoginPage.open();

    await LoginPage.loginFailLast("tomsmith", "SuperSecretPassword!");
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveTextContaining(
      "You logged into a secure area!"
    );
  });

  it("Chapter 5: Fail First clickAdv with pageSync and autoscroll", async () => {
    // await helpers.log(Promise) // Unit test log returns warning when anything but string is passsed
    await LoginPage.open();

    await LoginPage.loginFailFirst("tomsmith", "SuperSecretPassword!");
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveTextContaining(
      "You logged into a secure area!"
    );
  });

  it("Chapter 5: navToTypes - autoscroll", async () => {
    // await helpers.log(Promise) // Unit test log returns warning when anything but string is passsed
    await LandingPage.open();
    await LandingPage.navToTypos();

    // await expect(typosPage.typoText).toHaveTextContaining(   'You logged into a secure area!');
  });

  it("Chapter 5: navToDynamicLoading - spinner", async () => {
    // await helpers.log(Promise) // Unit test log returns warning when anything but string is passsed
    await LandingPage.open();
    await LandingPage.navToDynamicLoading();
    await dynamicLoadingPage.navToSpinner();

    await expect(dynamicLoadingPage.txtHelloWorld).toHaveTextContaining(
      "Hello World"
    );
    await helpers.highlightOn(dynamicLoadingPage.txtHelloWorld);
    await helpers.pause(5000);
    await helpers.highlightOff(dynamicLoadingPage.txtHelloWorld);
  });


  fit("Chapter 5: Self-healing Link", async () => {
    // await helpers.log(Promise) // Unit test log returns warning when anything but string is passsed
    await LoginPage.open();

    await LoginPage.loginOld("tomsmith", "SuperSecretPassword!");
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveTextContaining(
      "You logged into a secure area!"
    );
  });

  it("should login with valid credentials", async () => {
    // await helpers.log(Promise) // Unit test log returns warning when anything but string is passsed
    await LoginPage.open();
    // Chapter 3
    // console.log (`Entering password`) // Intrinsic log
    // await global.log (`Entering password`) // Custom log

    await LoginPage.login("tomsmith", "SuperSecretPassword!");
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveTextContaining(
      "You logged into a secure area!"
    );
  });
});
=======
import LoginPage from  '../pageobjects/login.page';
import SecurePage from '../pageobjects/secure.page';

describe('My Login application', () => {
    it('should login with valid credentials', async () => {
        await LoginPage.open();

        LoginPage.login('tomsmith1', 'SuperSecretPassword!');
        expect(SecurePage.flashAlert).toBeExisting();
        expect(SecurePage.flashAlert).toHaveTextContaining(
            'You logged into a secure area!');

        // Chapter 4
        Promise.resolve().then( _ => console.log(`2`));
        setTimeout( _ => console.log(`3`),0);
        console.log(`1`);
    });
});


>>>>>>> chapter-4
