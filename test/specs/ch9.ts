"strict mode";
import LoginPage from "../pageobjects/login.page";
import SecurePage from "../pageobjects/secure.page";
import LandingPage from "../pageobjects/landing.page";
import * as helpers from "../../helpers/helpers";
import dynamicLoadingPage from "../pageobjects/dynamicLoading.page";

import allureReporter from "@wdio/allure-reporter";

describe("Chapter 9: The expect / assert / Should wrapper", () => {

  it("Chapter 9: using expectAdv to validate the assertion passed ", async () => {
    await LoginPage.open();
    let elem = await browser.$('#login > button > i');
    let bnText = await elem.getText();
    await helpers.expectAdv(bnText, 'equals', 'Login');
  });

  it("Chapter 9: using expectAdv to validate the assertion failure", async () => {
    await LoginPage.open();
    let elem = await browser.$('#login > button > i');
    let bnText = await elem.getText();
    await helpers.expectAdv(bnText, 'equa', 'Login');
  });

});
