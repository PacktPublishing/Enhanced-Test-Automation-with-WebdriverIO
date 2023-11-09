import { ASB } from "../../helpers/globalObjects";
import candymapperPage from "../pageObjects/candymapper.page";
import halloweenAttendPartyPage from "../pageObjects/halloweenAttendParty.page";
import halloweenHostPartyPage from "../pageObjects/halloweenHostParty.page";
import halloweenPartyPage from "../pageObjects/halloweenParty.page";
import halloweenPartyLocationPage from "../pageObjects/halloweenPartyLocation.page";
import halloweenPartyTimerPage from "../pageObjects/halloweenPartyTimer.page";

class StateDrivenUtils {

  public parseTestData(testData: string = '') {
    if (testData != "") {
      testData = " " + testData.toLowerCase(); // Add space to make sure we match whole words and convert to lowercase once

      // if (testData.includes(" host")) {
      //   ASB.set("hostOrAttend", "host");
      // } else if (testData.includes(" attend")) {
      //   ASB.set("hostOrAttend", "attend");
      // }

      // 
      // switch (true) {
      //   case testData.includes(" host"):
      //     ASB.set("hostOrAttend", "host");
      //   case testData.includes(" attend"):
      //     ASB.set("hostOrAttend", "attend");
      //   case testData.includes(" zombie"):
      //     ASB.set("location", "zombieton");
      //   case testData.includes(" ghost"):
      //     ASB.set("location", "ghostville");
      //   case testData.includes(" scared"):
      //   case testData.includes(" skip"):
      //     ASB.set("location", "skip");
      // }
      //


      // switch (testData !== '' ) {
      switch (true ) {
        case testData.includes(" host"): {
          ASB.set("hostOrAttend", "host");
        }
          break;
        case testData.includes(" attend"): {
          ASB.set("hostOrAttend", "attend");
        }
          break;
        case testData.includes(" zombie"): {
          ASB.set("location", "zombieton");
        }
          break;
        case testData.includes(" ghost"): {
          ASB.set("location", "ghostville");
        }
          break;
        case testData.includes(" scared"): {
          ASB.set("location", "scared");
        }
          break;
        case testData.includes(" skip"): {
          ASB.set("location", "skip");
        }
          break;

        default:
          ASB.set("hostOrAttend", "host");

      }

      //  Set the environment - default to prod: candymapper.com
      //  stage: candymapperR2.com
      //
      // ASB.set("env", testData.includes(" stage") ? "stage" : "prod");
      ASB.set("env", testData.includes(" dev") ? "dev" : "prod");

    }

  }

  public async partyPath(testData) {

    let complete: Boolean = false;
    let lastPage: string = ""
    let success = false;
    let retry = 2

    this.parseTestData(testData);  // Parse the test data to set the ASB

    while (complete === false ) { // Loop until the final page is found or page did not change or an error occurs

      //Get Page Name
      // pageName = await browser.getTitle();
      // pageName = pageName.toLowerCase();
      // pageName = pageName.replace(" ", "-");
      // ASB.set("page", pageName);

   
      let pageName = await browser.getUrl();
      ASB.set("page", pageName);
      //pageName.replace(" ", "-");
   

     // let unknownPage = false;

      //knownPage =  
      await candymapperPage.build() 
      await halloweenAttendPartyPage.build() 
      await halloweenHostPartyPage.build() 
      await halloweenPartyLocationPage.build() 
      await halloweenPartyPage.build() 
      await halloweenPartyTimerPage.build();

      pageName = await browser.getUrl();
      console.log("*****************1  ", pageName);
      pageName = extractPathFromUrl(pageName)

      ASB.set("page", pageName);
      console.log("***************** 2 ", pageName);

      // unknownPage =  
      //         await halloweenAttendPartyPage.build() ||
      //         await halloweenHostPartyPage.build() ||
      //         await halloweenPartyLocationPage.build() ||
      //         await halloweenPartyPage.build() ||
      //         await halloweenPartyTimerPage.build();

      // Exit Point #1: Page did not change
      if (lastPage === pageName) {
        complete = true;
        // console.log(`Page did not change 2 : ${pageName} - Exiting Journey`);
        console.log(`Page did not change 3 : ${lastPage} - Exiting Journey`);
      }

      // // Exit Point #2: Unknown page encountered
      //if (unknownPage) {
        // One of the build methods returned true
    //} else {
        // None of the build methods returned true
    //}

      // let knownPage = false;
      
      // if (ASB.get("page") === "unknown") {
      //   knownPage = false;
      // }
      // else {
      //   knownPage = true;
      // }
      // if (knownPage == false) {
      //   complete = true;
      //   console.log(`Unknown Page detected: ${ASB.get("page")} - Exiting Journey`);
      // }

      // Exit Point #3: We were scared and went back -Halloween Party Home page reached - error 404 in prod / works in stage
     console.log(`*****************  Page Name: ${ASB.get("page")}`)

      if (ASB.get("page") === "halloween-party") {
        console.log("Halloween Party Home page reached")
        complete = true;
      }
      

      lastPage = ASB.get("page"); // Save the last page name
    }
  }



}
function extractPathFromUrl(url: string) {
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 1];
}

export default new StateDrivenUtils();