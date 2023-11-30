import LoginPage from "../pageObjects/login.page";
import * as helpers from "../../helpers/helpers";

describe("Chapter 8: The Assert Wrapper the Importance of Embedded Details", () => {
  it("Chapter 8: using expectAdv to validate the assertion passed ", async () => {
    await LoginPage.open();
    let elem = await browser.$('#login > button > i');
    let bnText = await elem.getText();
    await helpers.expectAdv(bnText, 'equals', 'Login');
    await helpers.expectAdv(elem, 'toHaveTextContaining', (["You logged into a secure area!"]));
    await helpers.expectAdv(elem, 'exists', null);
  });

  it("Chapter 8: using expectAdv to validate the assertion failure", async () => {
    await LoginPage.open();
    let elem = await browser.$('#login > button > i');
    let bnText = await elem.getText();
    await helpers.expectAdv(bnText, 'equa', 'Login');
  });
});
