import * as helpers from "../../helpers/helpers";
import Page from "./page";

let today = helpers.getToday(0, 'MM-dd-yyyy');
let nextWeek = helpers.getToday(7, 'MM-dd-yyyy');
let lastWeek = helpers.getToday(-7, 'MM-dd-yyyy');
let lastYear = helpers.getToday(365, 'MM-dd-yyyy');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class KeyPressesPage extends Page {
  /**
   * define selectors using getter methods
   */
  public get fldTarget() {
    return $(`input[type="text"]`);
  }

  /**
   * a method to encapsule automation code to interact with the page
   * e.g. to login using username and password
   */
  public async enterDateTags() {
    await helpers.setValueAdv(await this.fldTarget, `today is ${helpers.getToday(0, 'dd-mm-yyyy')}`);
    helpers.pause(2000);

    await helpers.setValueAdv(await this.fldTarget,
      `next week is ${helpers.getToday(7, 'dd-mm-yyyy')} and last week was ${helpers.getToday(-7, 'dd-mm-yyyy')}`);
      helpers.pause(2000);

      await helpers.setValueAdv(await this.fldTarget, 
      `Last year is ${helpers.getToday(-365, 'dd-mm-yyyy')}`);
      helpers.pause(2000);

  }
}
export default new KeyPressesPage();
