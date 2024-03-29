import LoginPage from "../pageObjects/login.page";
import stateDrivenUtils from "../utilities/stateDriven.utils";

// To run against Production - which has one intentional error - use the following command:
// > yarn ch14prod

// To run against Dev - which is working - use the following command:
// > yarn ch14dev

let env: string;

beforeEach(async () => {  
  // Determines the environment to run the test in from the command line
  // Default to prod: candymapper.com
  // stage: candymapperR2.com
  // env = process.env.ENV || "prod";
  await LoginPage.open(``); // Nav to Candymapper.com Prod or Dev
});


describe("Chapter 14: The Time Traveller's Dillema - State-drive Automation - Host a Party (Default in Ghostville)",  () => {
  it("should loop around until the final page is found", async () => {
    await stateDrivenUtils.partyPath("Host"); // Host path through the party
  });
});

describe("Chapter 14: State-drive Automation - Host a Party (Default in Ghostville)",  () => {
  it("should loop around until the final page is found", async () => {
    await stateDrivenUtils.partyPath("Host"); // Host path through the party
  });
});

describe("Chapter 14: State-drive Automation - Attend a Party (Default in Ghostville)", () => {
  it("should loop around until the final page is found", async () => {
   
    await stateDrivenUtils.partyPath("attend"); // Attend path through the party
  });
});

describe("Chapter 14: State-drive Automation - Host a Zombie Themed Party", () => {
  it("should loop around until the final page is found", async () => {
   
   await stateDrivenUtils.partyPath("host Zombies"); // Host path through the party
  });
});

describe("Chapter 14: State-drive Automation - Host a Ghost Themed Party", () => {
  it("should loop around until the final page is found", async () => {
  
   await stateDrivenUtils.partyPath("host Ghosts"); // Host path through the party
  });
});

describe("Chapter 14: State-drive Automation - Skip the Party", () => {
  it("should loop around until the home page is found", async () => {

   await stateDrivenUtils.partyPath("Attend"); // Skip path through the party
  });
});

describe("Chapter 14: State-drive Automation - Skip the Party. Too Scared", () => {
  it("should loop around until the home page is found", async () => {
 
   await stateDrivenUtils.partyPath("attend scared"); // Skip path through the party
  });
});

describe("Chapter 14: State-drive Automation - Attend Zombieton Party", () => {
  it("should loop around until the home page is found", async () => {
 
   await stateDrivenUtils.partyPath("attend ZOMBIETON"); // Skip path through the party
  });
});

describe("Chapter 14: State-drive Automation - Attend Ghostville Party", () => {
  it("should loop around until the home page is found", async () => {

  await stateDrivenUtils.partyPath("attend GhostVille"); // Skip path through the party
  });
});
