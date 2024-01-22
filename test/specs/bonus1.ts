import LoginPage from "../pageObjects/login.page";
import SecurePage from "../pageObjects/secure.page";
import { ASB } from "../../helpers/globalObjects";

describe("Bonus 1: Embed a 500ms wait before every click", () => {

        beforeEach(async () => {
            ASB.set("SLOW_MODE", true);
        });

        it('Should PASS to logon as clicks are slowed', async () => {
            await LoginPage.open();
            await LoginPage.login("tomsmith", "SuperSecretPassword!");
            await expect(SecurePage.flashAlert).toBeExisting();
            await expect(SecurePage.flashAlert).toHaveTextContaining(
                "You logged into a secure area!"
            );
        });
})