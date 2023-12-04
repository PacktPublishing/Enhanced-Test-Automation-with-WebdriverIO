import LoginPage from "../pageObjects/login.page";
import SecurePage from "../pageObjects/secure.page";

describe("Chapter 10: Increased Flexibility - Writting Robust selectors and Reducing Maintenence", () => {
  it("will handle stale element fields and an <0> anchor link that changed to a button since last release", async () => {
    await LoginPage.open();
    await LoginPage.stalelogin("tomsmith", "SuperSecretPassword!");
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveTextContaining(
      "You logged into a secure area!"
    );
  });
});

