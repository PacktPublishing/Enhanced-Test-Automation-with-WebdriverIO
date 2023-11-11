import LoginPage from "../pageobjects/login.page";
import * as helpers from "../../helpers/helpers";

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