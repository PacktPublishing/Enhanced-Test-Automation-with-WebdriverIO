import LoginPage from "../pageObjects/login.page";
import SecurePage from "../pageObjects/secure.page";
import * as helpers from "../../helpers/helpers";
import * as Data from "../../shared-data/userData.json";

describe("Ch12: Using Data files to pass values", () => {
  it("should login with valid credentials", async () => {
    await LoginPage.open();

    await LoginPage.login(Data.userData.username, Data.userData.password);
    await helpers.expectAdv(SecurePage.flashAlert, 'exists', null);
    await helpers.expectAdv(SecurePage.flashAlert, 'toHaveTextContaining', (["You logged into a secure area!"]));
  });
});
