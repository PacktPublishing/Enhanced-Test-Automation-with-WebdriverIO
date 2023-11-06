
// Host or Attend a party in Ghostville or Zombieton
import halloweenPartyPage from "../pageobjects/halloweenParty.page";
import halloweenAttendPartyPage from "../pageobjects/halloweenAttendParty.page";
import halloweenHostPartyPage from "../pageobjects/halloweenHostParty.page";
import halloweenPartyLocationPage from "../pageobjects/halloweenPartyLocation.page";
import halloweenPartyTimerPage from "../pageobjects/halloweenPartyTimer.page";
import * as helpers from "../../helpers/helpers";

import { ASB } from "../../helpers/globalObjects";

function parseTestData(testData: any) {
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

export async function partyPath(testData) {

    let complete: Boolean = false;
    let lastPage: string = ""
    let success = false;
    let retry = 2
  
    parseTestData(testData);  // Parse the test data to set the ASB
    
    while (complete === false) { // Loop until the final page is found or page did not change or an error occurs
  
      //Get Page Name
      export async function partyPath(testData) {
        const ASB = new Map<string, string>();
        let complete: Boolean = false;
        let lastPage: string = "";
        let success = false;
        let retry = 2;

        parseTestData(testData); // Parse the test data to set the ASB

        while (complete === false) {
          // ...
  
      // Exit point #2: Unknown page enountered
      let knownPage = false;
      while (complete === false) {
        // ...
        // Exit Point #2: Unknown page enountered
        if (ASB.get("page") === "unknown") {
          knownPage = false;
        } else {
          knownPage = true;
        }
        if (knownPage == false) {
          complete = true;
          console.log(`Unknown Page detected: ${ASB.get("page")} - Exiting Journey`);
        }
        // ...
      }
  
      // Exit Point #4: Halloween Party Home page reached
      if (ASB.get("page") === "halloween-party") {
        complete = true;
        console.log("Halloween Party Home page reached")
      }
  
      lastPage = ASB.get("page"); // Save the last page name
      complete = false;
    }
  }
  
  




  