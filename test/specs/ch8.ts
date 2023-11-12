import LoginPage from "../pageObjects/login.page";
import * as helpers from "../../helpers/helpers";

describe("Chapter 8: The expect / assert / Should wrapper", () => {

  it("Chapter 8: Ensuring that soft assert works correctly", async () => {
    await LoginPage.open();

    await LoginPage.loginFailLast("tomsmith", "SuperSecretPassword!");
    let elem = await browser.$('#login > button > i');
    await expect(await elem).toHaveTextContaining(
      "You logged into a secure area!"
    );
    await expect(await elem).toBeExisting();
  });

  it("Chapter 8: using expectAdv to validate the assertion passed ", async () => {
    await LoginPage.open();
    let elem = await browser.$('#login > button > i');
    let bnText = await elem.getText();
    await helpers.expectAdv(bnText, 'equals', 'Login');
  });

  it("Chapter 8: using expectAdv to validate the assertion failure", async () => {
    await LoginPage.open();
    let elem = await browser.$('#login > button > i');
    let bnText = await elem.getText();
    await helpers.expectAdv(bnText, 'equa', 'Login');
  });

});
