import LoginPage from "../pageObjects/login.page";
import SecurePage from "../pageObjects/secure.page";

describe("Ch2: Fortress of Solitude", () => {
  it("should login with valid credentials", async () => {
    await LoginPage.open("login");

    await LoginPage.login("tomsmith", "SuperSecretPassword!");
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveTextContaining(
      "You logged into a secure area!"
    );
  });
});
