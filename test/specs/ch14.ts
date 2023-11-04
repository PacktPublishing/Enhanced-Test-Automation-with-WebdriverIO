import LoginPage from "../pageobjects/login.page";
import SecurePage from "../pageobjects/secure.page";
import * as helpers from "../../helpers/helpers";
import * as Data from "../../shared-data/userData.json";

describe("Ch14: State-drive Automation", () => {
  it("should loop around until the final page is found", async () => {
    await LoginPage.open();

    helpers.partyPath();

  });


});

