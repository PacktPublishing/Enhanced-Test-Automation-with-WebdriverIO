import allureReporter from "@wdio/allure-reporter";
import LoginPage from "../pageObjects/login.page";
import SecurePage from "../pageObjects/secure.page";
import * as Data from "../../shared-data/userData.json";


describe("Ch12: Using Data files to pass values", () => {
  it("should login with valid credentials", async () => {
    allureReporter.addStory("TA-001");
    allureReporter.addFeature("Automation Hello World");
    allureReporter.addDescription("Verify the user can login", 'html');
    await LoginPage.open();

    await LoginPage.login(Data.userData.username, Data.userData.password);
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveTextContaining(
      "You logged into a secure area!"
    );
  });
});
