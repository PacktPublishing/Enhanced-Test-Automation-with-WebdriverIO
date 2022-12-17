//console.log(`LOADING  Framework Helpers...`);

module.exports = {
    helpersLoaded: async () => {
        console.log(`COMPLETE Framework Helpers`);
    }
}

url: async (url:string, timeout: number) => {
    const urlTimeout = timeout || global.setTimeout
    await browser.waitUntil(browser.$("body"),timeout);
}