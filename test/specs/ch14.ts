import LoginPage from "../pageObjects/login.page";
import stateDrivenUtils from "../utilities/stateDriven.utils";

// code that executes before every test

let env: string;

beforeEach(async () => {  
  // Determines the environment to run the test in from the command line
  // Default to prod: candymapper.com
  // stage: candymapperR2.com
  // env = process.env.ENV || "prod";
  await LoginPage.open(``); // Nav to Candymapper.com Prod or Dev
});


describe("Ch14: State-drive Automation - Host a Party (Default in Ghostville)",  () => {
  it("should loop around until the final page is found", async () => {
    await stateDrivenUtils.partyPath("Host"); // Host path through the party
  });
});

describe("Ch14: State-drive Automation - Attend a Party (Default in Ghostville)", () => {
  it("should loop around until the final page is found", async () => {
    //await LoginPage.open(``); // Nav to Candymapper.com Prod or Dev
    await stateDrivenUtils.partyPath("attend"); // Attend path through the party
  });
});

describe("Ch14: State-drive Automation - Host a Zombie Themed Party", () => {
  it("should loop around until the final page is found", async () => {
    //await LoginPage.open(``); // Nav to Candymapper.com Prod or Dev
   await stateDrivenUtils.partyPath("host theme=Zombies"); // Host path through the party
  });
});

describe("Ch14: State-drive Automation - Host a Ghost Themed Party", () => {
  it("should loop around until the final page is found", async () => {
    //await LoginPage.open(``); // Nav to Candymapper.com Prod or Dev
   await stateDrivenUtils.partyPath("host theme=Ghosts"); // Host path through the party
  });
});

describe("Ch14: State-drive Automation - Skip the Party", () => {
  it("should loop around until the home page is found", async () => {
    // await LoginPage.open(``); // Nav to Candymapper.com Prod or Dev
   await stateDrivenUtils.partyPath("Attend"); // Skip path through the party
  });
});

describe("Ch14: State-drive Automation - Skip the Party. Too Scared", () => {
  it("should loop around until the home page is found", async () => {
  //await LoginPage.open(``); // Nav to Candymapper.com Prod or Dev
   await stateDrivenUtils.partyPath("attend location=scared"); // Skip path through the party
  });
});

describe("Ch14: State-drive Automation - Attend Zombieton Party", () => {
  it("should loop around until the home page is found", async () => {
  // await LoginPage.open(``); // Nav to Candymapper.com Prod or Dev
   await stateDrivenUtils.partyPath("attend location=ZOMBIETON"); // Skip path through the party
  });
});

describe("Ch14: State-drive Automation - Attend Ghostville Party", () => {
  it("should loop around until the home page is found", async () => {
  //await LoginPage.open(``); // Nav to Candymapper.com Prod or Dev
  await stateDrivenUtils.partyPath("attend location=GhostVille"); // Skip path through the party
  });
});
