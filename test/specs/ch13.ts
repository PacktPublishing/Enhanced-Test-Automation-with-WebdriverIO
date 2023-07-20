import LoginPage from "../pageobjects/login.page";
import SecurePage from "../pageobjects/secure.page";
import * as Data from "../../shared-data/userData.json";

describe("Ch13: Cross Browser Testing", () => {
  it("should login with valid credentials", async () => {
    await LoginPage.open();

    await LoginPage.login(Data.userData.username, Data.userData.password);
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveTextContaining(
      "You logged into a secure area!"
    );
  });
});
