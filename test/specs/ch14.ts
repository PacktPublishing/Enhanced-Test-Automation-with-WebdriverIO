import LoginPage from "../pageobjects/login.page";
import stateDrivenUtils from "../utilities/stateDriven.utils";

// code that executes before every test

beforeEach(async () => {  
  // Determines the environment to run the test in from the command line
  // Default to prod: candymapper.com
  // stage: candymapperR2.com
  let env = process.env.ENV || "prod";
  await LoginPage.open(env);
});

describe("Ch14: State-drive Automation - Host a Party (Default in Ghostville)", () => {
  it("should loop around until the final page is found", async () => {
   stateDrivenUtils.partyPath("host"); // Host path through the party
  });
});

describe("Ch14: State-drive Automation - Host a Party in Zombieton", () => {
  it("should loop around until the final page is found", async () => {
    stateDrivenUtils.partyPath("host zombieton"); // Host path through the party
  });
});

describe("Ch14: State-drive Automation - Attend a Party (Default in Zombieton)", () => {
  it("should loop around until the final page is found", async () => {
    stateDrivenUtils.partyPath("attend"); // Attend path through the party
  });
});

describe("Ch14: State-drive Automation - Skip the Party", () => {
  it("should loop around until the home page is found", async () => {
    stateDrivenUtils.partyPath("skip"); // Skip path through the party
  });
});

describe("Ch14: State-drive Automation - Attend a Party in Zombieton", () => {
  it("should loop around until the final page is found", async () => {
    stateDrivenUtils.partyPath("attend zombieton"); // Attend path through the party
  });
});
