import LoginPage from "../pageobjects/login.page";
import SecurePage from "../pageobjects/secure.page";

describe("Ch2: Fortress of Solitude", () => {
  fit("should login with valid credentials", async () => {
    await LoginPage.open();

    await LoginPage.login("tomsmith", "SuperSecretPassword!");
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveTextContaining(
      "You logged into a secure area!"
    );
  });
});
