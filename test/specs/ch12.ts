import allureReporter from "@wdio/allure-reporter";
import LoginPage from "../pageObjects/login.page";
import SecurePage from "../pageObjects/secure.page";
import * as helpers from "../../helpers/helpers";
import * as Data from "../../shared-data/userData.json";

describe("Ch12: Using Data files to pass values", () => {
  // To see the allure report after the test, run the following command:
  // > yarn report
  beforeEach(async () => {
    await LoginPage.open();
  });

  it("should login with valid credentials", async () => {
    allureReporter.addStory("TA-001");
    allureReporter.addFeature("Automation Hello World");
    allureReporter.addDescription("Verify the user can login", 'html');

    await LoginPage.login(Data.userData.username, Data.userData.password);
    await helpers.expectAdv(SecurePage.flashAlert, 'exists', null);
    await helpers.expectAdv(SecurePage.flashAlert, 'toHaveTextContaining', (["You logged into a secure area!"]));
  });
});
