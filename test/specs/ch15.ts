import LoginPage from "../pageObjects/login.page";
import stateDrivenUtils from "../utilities/stateDriven.utils";

// Host or Attend a party in Ghostville or Zombieton

beforeEach(async () => {
    await LoginPage.open(``); // Nav to Candymapper.com Prod or Dev
  });

  describe("Ch15: State-drive Automation for Manual Testers",  () => {
    it("should loop around until the final page is found", async () => {
        let testData = process.env.JOURNEY || ""; // Get test data from JOURNEY environment variable set by Jenkin
        await stateDrivenUtils.partyPath(testData); // Host path through the party
    });
  });
