import LoginPage from "../pageObjects/login.page";
import * as helpers from "../../helpers/helpers";

describe("Chapter 8: The expectAdv wrapper", () => {
  it("Chapter 8: using expectAdv to validate the text assertion passed ", async () => {
    await LoginPage.open();
    let elem = await browser.$('#login > button > i');
    let actualText = await elem.getText();
    await helpers.expectAdv(actualText, 'equals', 'Login');
    await helpers.expectAdv(elem, 'to Have Text Containing', (["You logged into a secure area!"]));
    await helpers.expectAdv(elem, 'exists', null);
  });
});

/*
"equals", 
"contains", 
"exists", 
"is enabled", 
"is disabled", 
"does not exist", 
"does not contain", 
"to have text containing", 
"contains text"
"invalid assertion type"
*/

describe("Chapter 8: The expectAdv wrapper", () => {
  it("Chapter 8: using expectAdv to validate the button exsists and enabled", async () => {
    await LoginPage.open();
    let elem = await browser.$('#login > button');
    let actualText = await elem.getText();
    await helpers.expectAdv(elem, 'exists');
    await helpers.expectAdv(elem, 'is enabled');
  });

});

describe("Chapter 8: The expectAdv wrapper - Bogus button", () => {
  it("Chapter 8: using expectAdv to validate the bogus button does not exist", async () => {
    await LoginPage.open();
    let bogusElem = await browser.$(`//button[type='bogus']`);
    await helpers.expectAdv(bogusElem, 'does not exist');
  });


  fit("Chapter 8: Intentional Failure using expectAdv to validate the bogus button exists and enabled", async () => {
    await LoginPage.open();
    await LoginPage.expectBogusToexistAndBeEnabled();
  });

  it("Chapter 8: using expectAdv to validate the assertion failure", async () => {
    await LoginPage.open();
    let elem = await browser.$(`#login > button > i`);
    let actualText = await elem.getText();
    await helpers.expectAdv(actualText, 'equals', 'Log on');
  });

  it("Chapter 8: Intentional failure using expectAdv with invalid assertion typeo 'equa'", async () => {
    await LoginPage.open();
    let elem = await browser.$(`#login > button > i`);
    let actualText = await elem.getText();
    await helpers.expectAdv(actualText, 'equa', 'Login');
  });


});
