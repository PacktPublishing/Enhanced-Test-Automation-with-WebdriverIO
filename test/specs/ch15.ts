import LoginPage from "../pageObjects/login.page";
import stateDrivenUtils from "../utilities/stateDriven.utils";

// Host or Attend a party in Ghostville or Zombieton

beforeEach(async () => {
    await LoginPage.open(``); // Nav to Candymapper.com Prod or Dev
  });

  describe("Chapter 15: The Sentient Cape - Running Tests in a CI/CD Pipeline with Jenkins and LambdaTest",  () => {
    it("State-drive Automation for Manual Testers that loops around until the final page is reached", async () => {
        let testData = process.env.JOURNEY || ""; // Get test data from JOURNEY environment variable set by Jenkin
        await stateDrivenUtils.partyPath(testData); // Host path through the party
    });
  });
