import LoginPage from "../pageObjects/login.page";
import SecurePage from "../pageObjects/secure.page";

describe("Chapter 10: Self-healing stale elements: input locators and anchor link", () => {
  it("will handle stale element fields and an <a> anchor that changed from last release", async () => {
    await LoginPage.open();
    await LoginPage.stalelogin("tomsmith", "SuperSecretPassword!");
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveTextContaining(
      "You logged into a secure area!"
    );
  });
});

