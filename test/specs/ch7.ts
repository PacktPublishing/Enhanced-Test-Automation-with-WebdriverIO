import WebListPage from "../pageObjects/weblist.page";
describe("The select Wrapper: Selecting from List and Combobox", () => {

    it("Chapter 7: Select from a Combo Box", async () => {
        let elem;
        // Navigate to a sample weblist
        await WebListPage.open("components/dropdowns/combobox/");
        // this handles the cookie popup if required
        elem = await browser.$('[id="onetrust-accept-btn-handler"]')
        if(await elem.isExisting() === true){
            await elem.click();
        }
        await browser.pause(500);
        // This scrolls the page
        elem = await browser.$('[class="link-sc-6kfngc-0 HwYv"]')
        await elem.scrollIntoView();
        await browser.pause(500);
        // This gets you into the iFrame
        const iframe = await browser.findElement('css selector', 'iframe');
        await browser.switchToFrame(iframe);
        elem = await browser.$('[class="k-input-inner"]');
        await elem.scrollIntoView();
        await browser.pause(500);
        await elem.setValue('Cricket');
        await browser.keys('Enter');
        await browser.pause(3000);
    });

    it("Chapter 7: Selecting from a AutoComplete list", async () => {
        let elem;
        // Navigate to a sample weblist
        await WebListPage.open("components/dropdowns/autocomplete/");
        // this handles the cookie popup if required
        elem = await browser.$('[id="onetrust-accept-btn-handler"]')
        if(await elem.isExisting() === true){
            await elem.click();
        }
        await browser.pause(500);
        // This scrolls the page
        elem = await browser.$('[class="link-sc-6kfngc-0 HwYv"]')
        await elem.scrollIntoView();
        await browser.pause(500);
        // This gets you into the iFrame
        const iframe = await browser.findElement('css selector', 'iframe');
        await browser.switchToFrame(iframe);
        elem = await browser.$('[class="k-input-inner"]');
        await elem.scrollIntoView();
        await elem.doubleClick();
        await elem.setValue('Belg');
        await browser.keys('Enter');
        // Not sure how this 'findRestaurantsIn' function works to be honest
        // await WebListPage.findRestaurantsIn('Belgium');
        await browser.pause(10000);
    });
});