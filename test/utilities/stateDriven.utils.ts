import { ASB } from "../../helpers/globalObjects";

class StateDrivenUtils {

  public parseTestData(testData) {
    if (testData != "") {
      testData = " " + testData.toLowerCase(); // Add space to make sure we match whole words and convert to lowercase once

      if (testData.includes(" host")) {
        ASB.set("hostOrAttend", "host");
      } else if (testData.includes(" attend")) {
        ASB.set("hostOrAttend", "attend");
      }

      // 
      switch (true) {
        case testData.includes(" host"):
          ASB.set("hostOrAttend", "host");
        case testData.includes(" attend"):
          ASB.set("hostOrAttend", "attend");
        case testData.includes(" zombie"):
          ASB.set("location", "zombieton");
        case testData.includes(" ghost"):
          ASB.set("location", "ghostville");
        case testData.includes(" scared"):
        case testData.includes(" skip"):
          ASB.set("location", "skip");
      }

      //  Set the environment - default to prod: candymapper.com
      //  stage: candymapperR2.com
      ASB.set("env", testData.includes(" stage") ? "stage" : "prod");

    }

  }

  public async partyPath(testData) {

    let complete: Boolean = false;
    let lastPage: string = ""
    let success = false;
    let retry = 2

    this.parseTestData(testData);  // Parse the test data to set the ASB

    while (complete === false) { // Loop until the final page is found or page did not change or an error occurs

      //Get Page Name
      let pageName = await browser.getTitle();
      pageName = pageName.toLowerCase();
      pageName = pageName.replace(" ", "-");
      ASB.set("page", pageName);


      // Exit Point #1: Page did not change
      // if (lastPage === pageName) {
      //   complete = true;
      //   console.log(`Page did not change: ${pageName} - Exiting Journey`);
      // }

      // Exit Point #2: Unknown page enountered
      // let knownPage = false;
      // if (ASB.get("page") === "error-404") {
      //   knownPage = false;
      // } else {
      //   knownPage = true;
      // }
      // if (knownPage == false) {
      //   complete = true;
      //   console.log(`Unknown Page detected: ${ASB.get("page")} - Exiting Journey`);
      // }

      // Exit Point #3: Halloween Party Home page reached
      if (ASB.get("page") === "halloween-party") {
        complete = true;
        console.log("Halloween Party Home page reached")
      }

      lastPage = ASB.get("page"); // Save the last page name
      // complete = false;
    }
  }
}

export default new StateDrivenUtils();