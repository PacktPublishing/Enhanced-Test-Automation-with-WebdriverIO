import { ASB } from "../../helpers/globalObjects";
import candymapperPage from "../pageObjects/candymapper.page";
import halloweenAttendPartyPage from "../pageObjects/halloweenAttendParty.page";
import halloweenHostPartyPage from "../pageObjects/halloweenHostParty.page";
import halloweenPartyPage from "../pageObjects/halloweenParty.page";
import halloweenPartyLocationPage from "../pageObjects/halloweenPartyLocation.page";
import halloweenPartyThemePage from "../pageObjects/halloweenPartyTheme.page";
import halloweenPartyTimerPage from "../pageObjects/halloweenPartyTimer.page";
import * as helpers from "../../helpers/helpers";
import * as defaultJourney from "../../shared-data/userData.json";
import AllureReporter from "@wdio/allure-reporter";
import { exit } from "process";

class StateDrivenUtils {

  public parseTestData(testData: string = '') {

    if (process.env.JOURNEY !== undefined) {
      testData = process.env.JOURNEY;
    }



    if (testData != "") {
      testData = " " + testData.toLowerCase(); // Add space to make sure we match whole words and convert to lowercase once

      // setting default values
      ASB.set("hostOrAttend", "host");
      ASB.set("location", "zombieton");
      ASB.set("theme", "zombies");



      // defaultJourneyData.forEach((journey) => {
      //   ASB.set(journey.key, journey.value);
      // });



      // Overriding default values
      if (testData.includes(" host")) {
        ASB.set("hostOrAttend", "host");
      }
      if (testData.includes(" attend")) {
        ASB.set("hostOrAttend", "attend");
      }
      if (testData.includes(" zombie")) {
        ASB.set("location", "zombieton");
      }
      if (testData.includes(" ghost")) {
        ASB.set("location", "ghostville");
      }
      if (testData.includes(" scared")) {
        ASB.set("location", "scared");
      }



      // switch (testData !== '' ) {
      // switch (true) {
      //   case testData.includes(" host"): {
      //     ASB.set("hostOrAttend", "host");
      //   }
      //   // break;
      //   case testData.includes(" attend"): {
      //     ASB.set("hostOrAttend", "attend");
      //   }
      //   //break;
      //   case testData.includes(" scared"): {
      //     console.log("************ scared **************")
      //     ASB.set("location", "scared");
      //   }
      //   case testData.includes(" zombie"): {
      //     console.log("********** zombie **************")
      //     ASB.set("location", "zombieton");
      //   }
      //   // break;
      //   case testData.includes(" ghost"): {
      //     console.log("********** ghost **************")
      //     ASB.set("location", "ghostville");
      //   }
      //   // break;


      //   case testData.includes(" theme"): {
      //     ASB.set("theme", "zombies");
      //   }
      //   // break;
      //   //default:
      //   //  ASB.set("hostOrAttend", "host");

      // }

      //  Set the environment - default to prod: candymapper.com
      //  stage: candymapperR2.com
      //
      // ASB.set("env", testData.includes(" stage") ? "stage" : "prod");
    }

  }

  public async partyPath(testData) {

    let complete: Boolean = false;
    let lastPage: string = ""
    let retry = 2
   

    this.parseTestData(testData);  // Parse the test data to set the ASB
    helpers.parseToASB(testData);   // Parse the test data to set the ASB

    while (complete === false) { // Loop until the final page is found or page did not change or an error occurs
      let knownPage:boolean = false;

      //Get Page Name
      let pageName = await browser.getUrl();
      pageName = extractPathFromUrl(pageName)
      ASB.set("page", pageName);

      //knownPage =  
      await candymapperPage.build() // Move us from main to party page
      pageName = await browser.getUrl();
      pageName = extractPathFromUrl(pageName)
      ASB.set("page", pageName);


      knownPage =   
      await halloweenPartyPage.build() || // Move us from party page to host or attend page
      await halloweenPartyLocationPage.build() || // Move us from party location page to timer page
      await halloweenPartyThemePage.build() || // Move us from party page to host or attend page
      await halloweenAttendPartyPage.build();  // Move us from party page to host or attend page
      
      pageName = await browser.getUrl();
      pageName = extractPathFromUrl(pageName)
      ASB.set("page", pageName);

      // Exit Point #1: Success reached the timer page 
      if (await halloweenPartyTimerPage.build()){
        knownPage = true;
        console.log("Success: Reached the timer page")
        complete = true;
      
      } // End of all paths except unknown page

      // // Exit Point #2: Unknown page encountered
      if (knownPage === false) {
        //One of the build methods returned true
        console.log(`*************  Known Page detected = ${knownPage} **********************`)
        AllureReporter.addAttachment(`Unknown Page detected: ${pageName}`, "", "text/plain");
        
        console.log(`Unknown Page detected: ${pageName} - Exiting Journey`);
        complete = true;
        
        expect("Known Page").toBe(true); // This test will still run and pass

    }



      // Exit Point #3: Page did not change
      if (lastPage === pageName) {
        // Give two additional attempts
        retry--;

        if (retry === 0) {
          complete = true;
          console.log(`Page did not change: ${lastPage} - Exiting Journey`);
          expect("Page to more On").toBe(true); // This test will still run and pass
        }
      } else {
        // Page moved on
        console.log(`Page retry: ${retry})`);
        retry = 2;
      }



      // Exit Point #4: We were scared and went back -Halloween Party Home page reached - error 404 in prod / works in stage
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