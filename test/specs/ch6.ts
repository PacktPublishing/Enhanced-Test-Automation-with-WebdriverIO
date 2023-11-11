import LoginPage from "../pageObjects/login.page";
import SecurePage from "../pageObjects/secure.page";
import LandingPage from "../pageObjects/landing.page";
import * as helpers from "../../helpers/helpers";
import dynamicLoadingPage from "../pageObjects/dynamicLoading.page";
describe("The setValue Wrapper – Entering Text and Dynamic Data Replacement", () => {

    fit("Chapter 6: setValue Wrapper", async () => {
        // await helpers.log(Promise) // Unit test log returns warning when anything but string is passsed
    
        console.log(await helpers.getToday()); // returns current date in MM-dd-yyyy format
        console.log(await helpers.getToday(7, "d/M/yyyy")); // returns current date plus 5 days in d/M/yyyy format
        console.log(await helpers.getToday(-30, "yyyy/MM/dd")); // returns current date minus 3 days in yyyy/MM/dd format
    
        await LoginPage.open();
        // await LoginPage.loginSetValue("tomsmith", "SuperSecretPassword!");
    
        // await LoginPage.open("key_presses");
        // await KeyPressesPage.enterDateTags();
      });
  });