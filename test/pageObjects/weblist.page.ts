import Page from './page';
import * as helpers from "../../helpers/helpers";
/**
   * overwrite specific options to adapt it to page object
   */
class WebListPage extends Page {

  /**
   * define selectors using getter methods
   */
  public get lstCountriesByAncestor() {
    return $(`//input/ancestor::div[text()='Find restaurants in your country']`);
  }

  public get lstCountriesByAxis() {
    return $(`//div[text()='Find restaurants in your country']//following::input`);
  }

  public get lstCountriesByCloseMatch() {
    return $(`//div[contains(text(),'restaurant')]//following::input`);
  }

  public get lstCountriesCaseInsensitive() {
    return $(`//div[translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') = 'Find restaurants in your country']//following::input`);
  }

  public get lstCountriesVisible() {
    return $(`//div[translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') = 'Find restaurants in your country']//following::input`);
  }

  public get lstCountriesByBogus() {
    return $(`//select[@id='find_restaurants']`);
  }

  public get itmCountry() {
    return $(`//input/ancestor::div[1]`);
  }

  public async open(path: string) {
    return await super.open(`https://www.telerik.com/kendo-react-ui/${path}`);
    await browser.pause(2000);
  }

//span[normalize-space()='Belgium']

  public async findRestaurantsIn
  (country: string = " ") {
    // //span[normalize-space()='Belgium']
    await helpers.selectAdv(await this.lstCountriesByAxis, country)
  }

}



export default new WebListPage();