
import TelerikPage from "../pageObjects/telerik.page";

describe("The select Wrapper: Selecting from List and Combobox", () => {

    it("Chapter 7: Select from a Combo Box", async () => {
        let elem;
        // Navigate to a sample combobox weblist
        await TelerikPage.open("components/dropdowns/combobox/");
        await TelerikPage.selectSport("Cricket");
    });

    it("Chapter 7: Selecting from a AutoComplete list", async () => {
        let elem;
        // Navigate to a sample weblist
        await TelerikPage.open("components/dropdowns/autocomplete/");
        await TelerikPage.selectCountry("Denmark");
    });
});