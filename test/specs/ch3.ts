import LoginPage from "../pageObjects/login.page";
import SecurePage from "../pageObjects/secure.page";

describe("Ch3: Cybernetic Enhancements", () => {
  it('should give detailed report and resize browser', async () => {
    await LoginPage.open();
    // Chapter 3
    console.log (`Intrinsic log: Entering password`) 
    await global.log (`Custom log: Entering password`)
    await global.log (``) // Does not print empty string
    await global.log (null) // Does not print null value
    await global.log (Promise) // Adds trace back when passed an Promise

    await LoginPage.open();

    await LoginPage.login("tomsmith", "SuperSecretPassword!");
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveTextContaining(
       "You logged into a secure area!"
    );

  });
});
