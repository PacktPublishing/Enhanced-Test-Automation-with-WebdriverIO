"strict mode";
import WebListPage from "../pageobjects/weblist.page";
describe("The select Wrapper: Selecting from List and Combobox", () => {

    it("Chapter 7: Select Wrapper", async () => {
        let elem;
        // Navigate to a sample weblist
        await WebListPage.open("components/dropdowns/autocomplete/");
        // this handles the cookie popup if required
        elem = await browser.$('[id="onetrust-accept-btn-handler"]')
        if(elem){
            await elem.isExisting();
            await elem.click();
        }
        await browser.pause(500);
        // This scrolls the page
        elem = await browser.$('[class="link-sc-6kfngc-0 HwYv"]')
        await elem.scrollIntoView();
        await browser.pause(5000);
        // This gets you into the iFrame
        const iframe = await browser.findElement('css selector', 'iframe');
        await browser.switchToFrame(iframe);
        elem = await browser.$('[class="k-input-inner"]');
        await elem.scrollIntoView();
        await browser.pause(2000);
        console.log('This is the value of ln 23 ch7 =======>>>>>>>>>>>' ,await elem.isExisting());
        await elem.doubleClick();
        await elem.addValue('Belg');
        await elem.click();
        // Not sure how this 'findRestaurantsIn' function works to be honest
        // await WebListPage.findRestaurantsIn("Belgium");
        await browser.pause(8000);
      });
  });