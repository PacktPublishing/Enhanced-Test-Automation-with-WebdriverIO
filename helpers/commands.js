export async function clickAdv(element) {
    //chapter-5 Custom Commands

    // `this` is return value of $(selector)
    let elementName; // : String
    let success; // : boolean = false

    if (ASB.get(`alreadyFailed`) === true) {
        global.console.log(`    SKIPPED: browser.clickAdv(${this})`);

    } else {

        const clickASB = switchboardFactory();
        clickASB.set(`elementCommand`, ` Click `);
        clickASB.set(`elementType`, ` Button `);

        try {
            await this.waitForDisplayed();
            elementName = await this.getValue();

            await this.click();
            global.console.log(`  CLICKED ${elementName}`);
            success = true;

        } catch (error) {
            global.console.log(`    ERROR: browser.clickAdv(${elementName})
            /n        ${error}`);

            //Skip all other custom
            ASB.set(`alreadyFailed`, true);

        }

        return success;
    }

}