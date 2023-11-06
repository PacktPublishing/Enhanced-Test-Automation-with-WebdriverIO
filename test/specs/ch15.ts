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
import { partyPath } from "../utilities/stateDrivenUtils";

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
        partyPath(testData); // Attend path through the party
    });
});
