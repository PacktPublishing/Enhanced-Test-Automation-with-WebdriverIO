"strict mode";
import WebListPage from "../pageobjects/weblist.page";
describe("The select Wrapper: Selecting from List and Combobox", () => {

    it("Chapter 7: Select Wrapper", async () => {
        // Navigate to a sample weblist
        await WebListPage.open("components/dropdowns/autocomplete/");
        await WebListPage.findRestaurantsIn("Belgium");
      });
  });