import LoginPage from "../pageObjects/login.page";
import SecurePage from "../pageObjects/secure.page";
import LandingPage from "../pageObjects/landing.page";
import * as helpers from "../../helpers/helpers";
import dynamicLoadingPage from "../pageObjects/dynamicLoading.page";

//advanced self-healing

describe("Chapter 10: Intentional Fail Last clickAdv with pageSync and autoscroll", () => {

  it("Chapter 10: Self-healing Link", async () => {
    await LoginPage.open();
    // simulate an outdated selector that changed in latest release  
    await LoginPage.loginOld("tomsmith", "SuperSecretPassword!");
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveTextContaining(
      "You logged into a secure area!"
    );
  });

});