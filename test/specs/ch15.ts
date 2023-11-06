import LoginPage from "../pageobjects/login.page";

// Host or Attend a party in Ghostville or Zombieton
import stateDrivenUtils from "../utilities/stateDriven.utils";

describe("Ch15: State-drive Automation from Jenkins", () => {
    it("should loop around until the final or first page is found", async () => {
        // Get the test data from the JOURNEY environment variable
        // If empty use defaults
        // Determins the environment to run the test in from the command line
        // Default to prod: candymapper.com
        // stage: candymapperR2.com
        let env = process.env.ENV || "prod";
        await LoginPage.open(env);
        let testData = process.env.JOURNEY || "";
        stateDrivenUtils.partyPath(testData); // Attend path through the party
    });
});
