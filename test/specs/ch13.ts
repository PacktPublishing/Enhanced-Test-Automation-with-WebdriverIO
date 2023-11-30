import LoginPage from "../pageObjects/login.page";
import SecurePage from "../pageObjects/secure.page";
import * as helpers from "../../helpers/helpers";
import * as Data from "../../shared-data/userData.json";

describe("Ch13: Cross Browser and Cross Environment Testing", () => {

  beforeEach(async () => {
    await LoginPage.open();
  });

  it("should login with valid credentials", async () => {
    await LoginPage.login(Data.userData.username, Data.userData.password);
    await helpers.expectAdv(SecurePage.flashAlert, 'exists', null);
    await helpers.expectAdv(SecurePage.flashAlert, 'toHaveTextContaining', "You logged into a secure area!");
  });

  it('should open a website on Chrome', async () => {
    const title = await browser.getTitle();
    await helpers.expectAdv(title, 'contains', 'The Internet');
  });

  it('should open a website on Firefox', async () => {
    const title = await browser.getTitle();
    await helpers.expectAdv(title, 'contains', 'The Internet');
  });
});

