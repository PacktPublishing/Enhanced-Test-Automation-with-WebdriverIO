import LoginPage from "../pageobjects/login.page";
import SecurePage from "../pageobjects/secure.page";
import * as helpers from "../../helpers/helpers";
import * as Data from "../../shared-data/partyData.json";
import { ASB } from "../../helpers/globalObjects";

// Host or Attend a party in Ghostville or Zombieton
import halloweenPartyPage from "../pageobjects/halloweenParty.page";
import ha
import halloweenAttendPartyPage from "../pageobjects/halloweenAttendParty.page";


describe("Ch14: State-drive Automation - Host a Party (Default in Ghostville)", () => {
  it("should loop around until the final page is found", async () => {
    await LoginPage.open();
    partyPath("host"); // Host path through the party

  });
});

describe("Ch14: State-drive Automation - Host a Party in Zombieton", () => {
  it("should loop around until the final page is found", async () => {
    await LoginPage.open();
    partyPath("host zombieton"); // Host path through the party

  });
});

describe("Ch14: State-drive Automation - Attend a Party (Default in Zombieton)", () => {
  it("should loop around until the final page is found", async () => {
    await LoginPage.open();
    partyPath("attend"); // Attend path through the party

  });
});

describe("Ch14: State-drive Automation - Skip the Party", () => {
  it("should loop around until the home page is found", async () => {
    await LoginPage.open();
    partyPath("skip"); // Skip path through the party

  });
});

describe("Ch14: State-drive Automation - Attend a Party in Zombieton", () => {
  it("should loop around until the final page is found", async () => {
    await LoginPage.open();
    partyPath("attend zombieton"); // Attend path through the party

  });
});


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
    let knownPage = await halloweenPartyPage.build(testData) || // Default to host in Ghostville
    await halloweenAttendPartyPage.build(testData) || // Default to attend in Ghostville
    await halloweenHostPartyPage.build(testData) ||
    await halloweenChooseLocationPage.build(testData);
    // Add new pages along the journey here.  

    // Exit point: Countdown Page was reached
    complete = await halloweenPartyTimePage.build(testData) // Returns true if page is detected.

    // Exit point: Unknown page
    if (knownPage == false)) {
      complete = true;
      console.log("Unknown Page detected: " + ASB.get("page") + " - Exiting Journey");
    }

    // Exit Point: Same Page after 3 attempts
    if (lastPage === ASB.get("page")) {
      retry--;
      if (retry === 0) {
        complete = true;
        console.log("Page not found after 3 attempts")
      }
    }

    retry = 2;
    lastPage = ASB.get("page");

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
      
      ASB.set("env", testData.includes(" stage") ? "stage" : "prod");
  
  }
}


