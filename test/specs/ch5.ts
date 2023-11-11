import LoginPage from "../pageObjects/login.page";
import SecurePage from "../pageObjects/secure.page";
import LandingPage from "../pageObjects/landing.page";
import * as helpers from "../../helpers/helpers";
import dynamicLoadingPage from "../pageObjects/dynamicLoading.page";
describe("Chapter 5: Fail Last clickAdv with pageSync and autoscrolln", () => {

  it("Chapter 5: Fail Last clickAdv with pageSync and autoscroll", async () => {
    // await helpers.log(Promise) // Unit test log returns warning when anything but string is passsed
    await LoginPage.open();

    await LoginPage.loginFailLast("tomsmith", "SuperSecretPassword!");
    await expect(await SecurePage.flashAlert).toBeExisting();
    await expect(await SecurePage.flashAlert).toHaveTextContaining(
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
    await helpers.highlightOn(await dynamicLoadingPage.txtHelloWorld);
    await helpers.pause(5000);
    await helpers.highlightOff(await dynamicLoadingPage.txtHelloWorld);
  });

  it("Chapter 5: Self-healing Link", async () => {
    // await helpers.log(Promise) // Unit test log returns warning when anything but string is passsed
    await LoginPage.open();

    await LoginPage.loginOld("tomsmith", "SuperSecretPassword!");
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveTextContaining(
      "You logged into a secure area!"
    );
  });


  it("Chapter 5: Self-healing Link", async () => {
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
    await LoginPage.login("tomsmith", "SuperSecretPassword!");
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveTextContaining(
      "You logged into a secure area!"
    );
  });
});
