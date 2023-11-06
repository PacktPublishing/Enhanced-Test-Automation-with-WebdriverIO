import LoginPage from "../pageobjects/login.page";
import SecurePage from "../pageobjects/secure.page";
import * as helpers from "../../helpers/helpers";
import { ASB } from "../../helpers/globalObjects";

// Host or Attend a party in Ghostville or Zombieton
import halloweenPartyPage from "../pageobjects/halloweenParty.page";
import halloweenAttendPartyPage from "../pageobjects/halloweenAttendParty.page";
import halloweenHostPartyPage from "../pageobjects/halloweenHostParty.page";
import halloweenPartyLocationPage from "../pageobjects/halloweenPartyLocation.page";
import halloweenPartyTimerPage from "../pageobjects/halloweenPartyTimer.page";

// code that executes before every test
beforeEach(async () => {  
  // Determins the environment to run the test in from the command line
  // Default to prod: candymapper.com
  // stage: candymapperR2.com
  let env = process.env.ENV || "prod";
  await LoginPage.open(env);
});

describe("Ch14: State-drive Automation - Host a Party (Default in Ghostville)", () => {
  it("should loop around until the final page is found", async () => {
    partyPath("host"); // Host path through the party

  });
});

describe("Ch14: State-drive Automation - Host a Party in Zombieton", () => {
  it("should loop around until the final page is found", async () => {
    partyPath("host zombieton"); // Host path through the party

  });
});

describe("Ch14: State-drive Automation - Attend a Party (Default in Zombieton)", () => {
  it("should loop around until the final page is found", async () => {
    partyPath("attend"); // Attend path through the party

  });
});

describe("Ch14: State-drive Automation - Skip the Party", () => {
  it("should loop around until the home page is found", async () => {
    partyPath("skip"); // Skip path through the party

  });
});

describe("Ch14: State-drive Automation - Attend a Party in Zombieton", () => {
  it("should loop around until the final page is found", async () => {
    partyPath("attend zombieton"); // Attend path through the party

  });
});

describe("Ch15: State-drive Automation from Jenkins", () => {
  it("should loop around until the final or first page is found", async () => {
    // Get the test data from the JOURNEY environment variable
    // If empty use defaults
    let testData = process.env.JOURNEY || ""; 
    partyPath(testData); // Attend path through the party
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


