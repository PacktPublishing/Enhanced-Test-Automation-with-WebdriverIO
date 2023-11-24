import LoginPage from "../pageObjects/login.page";
import SecurePage from "../pageObjects/secure.page";
import LandingPage from "../pageObjects/landing.page";
import * as helpers from "../../helpers/helpers";
import dynamicLoadingPage from "../pageObjects/dynamicLoading.page";

// describe("Chapter 5: Intentional Fail Last clickAdv with pageSync and autoscroll", () => {

//   it("Chapter 5: navToTypos - autoscroll", async () => {
//     // await helpers.log(Promise) // Unit test log returns warning when anything but string is passsed
//     await LandingPage.open();
//     await LandingPage.navToTypos();
//     // await expect(typosPage.typoText).toHaveTextContaining(   'You logged into a secure area!');
//   });
// });

describe("Chapter 5: Buring wait time of Dynamically Loaded elements with spinner check embedded in clickAdv()", () => {
  // Example 1: Element on page that is hidden
  it(`Clicks Start with clickadv which waits for spinner before hidden "Hello World" is displayed`, async () => {
    await LandingPage.open();
    await LandingPage.navToDynamicLoading();
    
    // Click Hidden Element Start which displays a spinner with hidden "Hello World"
    // Flashes the spinner while waiting to disappear without additional wait commands
    await dynamicLoadingPage.clickStartWithHiddenElementAndSpinner();

    //Verify the hidden Hello World text appears after the spinner disappeared
    await expect(dynamicLoadingPage.txtHelloWorld).toHaveTextContaining(
      "Hello World"
    );

    //Highlight the Hello World text
    await helpers.highlightOn(await dynamicLoadingPage.txtHelloWorld);
    await helpers.pause(5000);
    await helpers.highlightOff(await dynamicLoadingPage.txtHelloWorld);
  });

  // Example 2: Element rendered after the fact
  it(`Clicks Start with clickadv which waits for spinner before "Hello World" is rendered`, async () => {
    await LandingPage.open();
    await LandingPage.navToDynamicLoading();
    
    // Click Hidden Element Start which displays a spinner before rendereing "Hello World"
    // Flashes the spinner while waiting to disappear without additional wait commands
    await dynamicLoadingPage.clickStartWithRenderedElementAndSpinner();

    //Verify the Hello World text was rendered after the spinner disappeared
    await expect(dynamicLoadingPage.txtHelloWorld).toHaveTextContaining(
      "Hello World"
    );

    //Highlight the Hello World text for 5 seconds
    await helpers.highlightOn(await dynamicLoadingPage.txtHelloWorld);
    await helpers.pause(5000);
    await helpers.highlightOff(await dynamicLoadingPage.txtHelloWorld);
  });

});

describe("Chapter 5: Intentional Fail Last clickAdv with pageSync and autoscroll", () => {

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

describe("Chapter 5: Intentional Fail Last clickAdv with pageSync and autoscroll", () => {

  it("Chapter 5: Self-healing Link", async () => {
    await LoginPage.open();
    await LoginPage.loginOld("tomsmith", "SuperSecretPassword!");
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveTextContaining(
      "You logged into a secure area!"
    );
  });

});

describe("Chapter 5: Intentional Fail Last clickAdv with pageSync and autoscroll", () => {

  it("Chapter 5: The last element in loginFailLast() is a bogus element", async () => {
    await LoginPage.open();
    await LoginPage.loginFailLast("tomsmith", "SuperSecretPassword!");
    await expect(await SecurePage.flashAlert).toBeExisting();
    await expect(await SecurePage.flashAlert).toHaveTextContaining(
        "You logged into a secure area!"
    );
  });
});

describe("Chapter 5: Intentional Fail Last clickAdv with pageSync and autoscroll", () => {

  it("Chapter 5: Fail First clickAdv with pageSync and autoscroll", async () => {
    await LoginPage.open();
    await LoginPage.loginFailFirst("tomsmith", "SuperSecretPassword!");
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveTextContaining(
        "You logged into a secure area!"
    );
  });

});
