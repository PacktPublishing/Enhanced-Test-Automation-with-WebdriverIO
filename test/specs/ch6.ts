"strict mode";
import LoginPage from "../pageObjects/login.page";
import KeyPressesPage from "../pageObjects/inputs.page";
import * as helpers from "../../helpers/helpers";

describe("The setValue Wrapper – Entering Text and Dynamic Data Replacement", () => {

    fit("Chapter 6: setValue Wrapper", async () => {
        await global.log(helpers.getToday()); // returns current date in dd-mm-yyyy format
        await global.log(helpers.getToday(5, "dd-mm-yyyy")); // returns current date plus 5 days in dd/mm/yyyy format
        await global.log(helpers.getToday(-3, "dd-mm-yyyy")); // returns current date minus 3 days in dd/mm/yyyy format
        await LoginPage.open("key_presses");
        await KeyPressesPage.enterDateTags();
      });
  });