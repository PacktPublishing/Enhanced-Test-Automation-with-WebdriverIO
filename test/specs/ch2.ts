import LoginPage from "../pageObjects/login.page";
import SecurePage from "../pageObjects/secure.page";

  // This test uses almost no custom framework except the wdio.shared.conf.ts custom commands
  describe("A near mortal WebdriverIO script", () => {
    it("should login with valid credentials", async () => {
      await LoginPage.open();

      // loginWdio is a function that uses only the WebdriverIO API
      await LoginPage.login("tomsmith", "SuperSecretPassword!");

      await expect(SecurePage.flashAlert).toBeExisting();
      await expect(SecurePage.flashAlert).toHaveTextContaining(
        "You logged into a secure area!"
      );
    });
  })

// This test uses the advanced library
describe("Ch2: Fortress of Solitude", () => {
  it("should login with valid credentials with details", async () => {
    await LoginPage.open();

    // login is a function that uses the wrapper methods
    await LoginPage.loginAdv("tomsmith", "SuperSecretPassword!");
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveTextContaining(
      "You logged into a secure area!"
    );
  });
});
