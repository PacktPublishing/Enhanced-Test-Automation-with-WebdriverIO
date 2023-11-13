import LoginPage from "../pageObjects/login.page";
import SecurePage from "../pageObjects/secure.page";

describe("Ch11: ", () => {
  it('should give detailed report and resize browser', async () => {
    await LoginPage.open();
    // Chapter 11 POM-less automation example

    await LoginPage.open();

    await LoginPage.loginWithoutPom("tomsmith", "SuperSecretPassword!");
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveTextContaining(
       "You logged into a secure area!"
    );

  });
});
