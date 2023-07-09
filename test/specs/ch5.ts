"strict mode";
import LoginPage from "../pageobjects/login.page";
import SecurePage from "../pageobjects/secure.page";
import LandingPage from "../pageobjects/landing.page";
import * as helpers from "../../helpers/helpers";
import dynamicLoadingPage from "../pageobjects/dynamicLoading.page";
import { expect as expectWebdriverIO } from 'expect-webdriverio';

describe("Chapter 5: Fail Last clickAdv with pageSync and autoscrolln", () => {


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
