import LoginPage from "../pageobjects/login.page";
import SecurePage from "../pageobjects/secure.page";
import LandingPage from "../pageobjects/landing.page";
import * as helpers from "../../helpers/helpers";
import dynamicLoadingPage from "../pageobjects/dynamicLoading.page";

describe("Chapter 8: The expect / assert / softAssert", () => {

    it("Chapter 8: using expectAdv (softAssert) to validate the assertion failure", async () => {
        await LoginPage.open();
        let elem = await browser.$('#login > button > i');
        let bnText = await elem.getText();
        await helpers.expectAdv(bnText, 'equal', 'Login');
    });

    it("Chapter 8: using expectAdv (softAssert) to validate the assertion passed ", async () => {
        await LoginPage.open();
        let elem = await browser.$('#login > button > i');
        let bnText = await elem.getText();
        await helpers.expectAdv(bnText, 'equals', 'Login');
    });
    
});