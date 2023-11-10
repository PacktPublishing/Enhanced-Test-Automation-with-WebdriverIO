import LoginPage from "../pageObjects/login.page";

// Host or Attend a party in Ghostville or Zombieton
import stateDrivenUtils from "../utilities/stateDriven.utils";



beforeEach(async () => {  
    // Determines the environment to run the test in from the command line
    // Default to prod: candymapper.com
    // stage: candymapperR2.com
    // env = process.env.ENV || "prod";
    await LoginPage.open(``); // Nav to Candymapper.com Prod or Dev
  });
  
  describe("Ch15: State-drive Automation for Manual Testers",  () => {
    it("should loop around until the final page is found", async () => {
        let testData = process.env.JOURNEY || ""; // Get test data from JOURNEY environment variable set by Jenkin
        await stateDrivenUtils.partyPath(testData); // Host path through the party
    });
  });


//   describe("Ch15: State-drive Automation from Jenkins", () => {
//     it("should loop around until the final or first page is found", async () => {
//         // Get the test data from the JOURNEY environment variable
//         // If empty use defaults
//         // Determins the environment to run the test in from the command line
//         // Default to prod: candymapper.com
//         // stage: candymapperR2.com
//         let env = process.env.ENV || "prod";
//         await LoginPage.open(env);
//         let testData = process.env.JOURNEY || ""; // Get test data from JOURNEY environment variable set by Jenkins
//         await stateDrivenUtils.partyPath(testData); // Attend path through the party
//     });
// });