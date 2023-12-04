import LoginPage from "../pageObjects/login.page";
import SecurePage from "../pageObjects/secure.page";
import DropdownPage from "../pageObjects/dropdown.page";

describe("Chapter 11: Echo Location - Find elements by text without a Page Object Model", () => {
  beforeEach(async () => {  
    await LoginPage.open();
  });

  // Chapter 11 POM-less automation example
  it(`should find 'username', 'password' fields and 'submit' button with text only`, async () => {
    // Uses test to find usename and password fields
    // Uses 'submit' type of element to find the submit button
    await LoginPage.loginWithoutPomSubmit("tomsmith", "SuperSecretPassword!");
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveTextContaining(
       "You logged into a secure area!"
    );
  });

  it(`should find 'username', 'password' fields and 'login' button with text only`, async () => {

    // Uses 'login' text to find the submit button
    await LoginPage.loginWithoutPom("tomsmith", "SuperSecretPassword!");
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveTextContaining(
       "You logged into a secure area!"
    );
  });


it(`should find a dropdown list with text only`, async () => {
  await LoginPage.open(`dropdown`);
  // Uses 'login' text to find the submit button
  await DropdownPage.selectOptionWithoutPom(`Option 1`);
  await DropdownPage.selectOptionWithoutPom(`Option 2`);
});
});
