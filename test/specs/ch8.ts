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


  it("Chapter 8: using expectAdv to validate the button exsists and enabled", async () => {
    await LoginPage.open();
    let elem = await browser.$('#login > button');
    let actualText = await elem.getText();
    await helpers.expectAdv(elem, 'exists');
    await helpers.expectAdv(elem, 'is enabled');
  });




  it("Chapter 8: using expectAdv to validate the bogus button does not exist", async () => {
    await LoginPage.open();
    let bogusElem = await browser.$(`//button[type='bogus']`);
    await helpers.expectAdv(bogusElem, 'does not exist');
  });

  it("Chapter 8: Intentional Failure using expectAdv to validate the bogus button exists and enabled", async () => {
    await LoginPage.open();
    await LoginPage.expectBogusToexistAndBeEnabled();
  });

  it("Chapter 8: Intentional Failure using expectAdv to validate the Login button is 'Log On'", async () => {
    await LoginPage.open();
    await LoginPage.expectLogOnButtonText();
  });

  it("Chapter 8: Expect the Login button is 'Login'", async () => {
    await LoginPage.open();
    await LoginPage.expectLogInButtonText();
  });

  it("Chapter 8: Intentional failure using expectAdv with invalid assertion typo 'equa'", async () => {
    await LoginPage.open();
    await LoginPage.expectLogInButtonTextWithEquaTypo();
  });

});

