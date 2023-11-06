
// Host or Attend a party in Ghostville or Zombieton
import halloweenPartyPage from "../pageobjects/halloweenParty.page";
import halloweenAttendPartyPage from "../pageobjects/halloweenAttendParty.page";
import halloweenHostPartyPage from "../pageobjects/halloweenHostParty.page";
import halloweenPartyLocationPage from "../pageobjects/halloweenPartyLocation.page";
import halloweenPartyTimerPage from "../pageobjects/halloweenPartyTimer.page";

export async function partyPath(testData) {

    let complete: Boolean = false;
    let lastPage: string = ""
    let success = false;
    let retry = 2
  
  
    parseTestData(testData);  // Parse the test data to set the ASB
    
    while (complete === false) { // Loop until the final page is found or page did not change or an error occurs
  
      //Get Page Name
      ASB.set("page", await helpers.getPageName());
  
      //Pass test data file to each page
      let knownPage = 
      await halloweenPartyPage.build(testData) || // Default to host in Ghostville
      await halloweenAttendPartyPage.build(testData) || // Default to attend in Ghostville
      await halloweenHostPartyPage.build(testData) ||
      await halloweenPartyLocationPage.build(testData);
      // Add new pages along the journey here...  
  
      // Exit point #1: Success! Countdown Page was reached
      complete = await halloweenPartyTimerPage.build(testData) // Returns true if page is detected.
  
      // Exit point #2: Unknown page enountered
      if (knownPage == false) {
        complete = true;
        console.log(`Unknown Page detected: ${ASB.get("page")} - Exiting Journey`);
      }
  
      // Exit Point #3: Same Page after 3 attempts
      if (lastPage === ASB.get("page")) {
        retry--;
        if (retry === 0) {
          complete = true;
          console.log("Page not found after 3 attempts")
        }
      }else{
        retry = 2; // Reset retry counter
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
  
  function parseTestData(testData: string) {
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
  