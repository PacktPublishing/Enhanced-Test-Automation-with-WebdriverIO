/* Updates for 2024!
 expect(el).toHaveTextContainingContaining() is being depreciated. 
 Replace with expect(el).toHaveText(expect.stringContaining('...')))
*/
import ts, { isStringLiteralOrJsxExpression } from "typescript";
import { ASB } from "./globalObjects";
import allureReporter from "@wdio/allure-reporter";


// "Ham wrapped in Bacon"
// Allows for a quick revert to the original function
// await clickAdv(await btnLogin); // Uses full framework
// await click(await btnLogin); // Click uses minimal framework

export async function click(element: WebdriverIO.Element | string
): Promise<void> {
  if (typeof element === "string") {
    // Partial framework solution Find the element as a xpath, CSS or text selector
    element = await $(await getValidElement(element, "button"));

    // This is the non-framework option
    // this.log (`FAIL: The standard click() function only supports WebdriverIO elements.\r\n{$element} is a string. Use clickAdv() instead.`)
  }
  return await element.click();
}

const IF_EXISTS = "IF_EXISTS";
export async function clickAdvIfExists(element: WebdriverIO.Element | string) {
  ASB.set(IF_EXISTS, true);
  let result = await this.clickAdv(element);
  ASB.set(IF_EXISTS, false);
  return result;
}

export async function clickAdv(element: WebdriverIO.Element | string) {
  let success: boolean = false;
  let errorMessage: string = "";
  let selector: string = "";

  // Self-healing element
  element = await getValidElement(element, "button");

  if (ASB.get("ELEMENT_EXISTS") === true) {
    // Element exists

    selector = element.selector.toString();
    await log(`Clicking selector "${selector}"`);
    try {
      if (!(await this.isElementInViewport(element))) {
        await this.scrollIntoView(element);
        await this.waitForElementToStopMoving(element, 3000);
      }
      await this.highlightOn(element);
      //@ts-ignore
      await element.click(); // ({ block: "center" });
      await this.pageSync();
      success = true;
      await log(`  PASS: Clicked selector "${ASB.get("SELECTOR")}"`);
    } catch (error: any) {
      errorMessage = error.message;

    }

  } else {
    // Element does not exist, but do not fail the test
    if (ASB.get(IF_EXISTS) === true) {

      await log(`  WARN: ClickIfExists - Skipped clicking selector "${ASB.get("SELECTOR")}" without failing the test`);
      ASB.set(IF_EXISTS, false)
      success = true;

    } else {
      // Element does not exist, fail the test
      await log(`  FAIL: Selector "${ASB.get("SELECTOR")}" was not clicked.\n       ${errorMessage}`);

      // Descriptive fail message
      await expect(ASB.get("SELECTOR")).toEqual(' to exist and be clickable');
      // Throw the error to stop the test
      //@ts-ignore
      await element.click()
    }
  }
  return success;
}


export async function findVisibleElement(locators: string[], elementName: string): Promise<WebdriverIO.Element | null> {
  let visibleElement: WebdriverIO.Element | null = null;
  let found = false;

  for (let locator of locators) {
    try {
      const elements = await $$(locator);
      for (let element of elements) {
        if (await element.isDisplayed()) {
          if (elements.length === 1) {
            await log(`PASS: Found "${elementName}" element with selector "${locator}"`);
          } else {
            await log(`PASS: Found ${elements.length} "${elementName}" elements with selector "${locator}"`);
          }
          visibleElement = element;
          found = true;
          break;
        }
      }
      if (visibleElement) {
        break;
      }
    } catch (error) {
      // Log or handle errors if needed
    }
  }

  if (!found) {
    await log(`ERROR: Could not find "${elementName}" element.`);
  }

  return visibleElement;
}

export async function findFieldElement(nameOrId: string): Promise<WebdriverIO.Element | null> {
  const locators = [
    `input[name='${nameOrId}']`,
    `input[id='${nameOrId}']`,
    `input[id*='${nameOrId}']`,
    `input[type='${nameOrId}']`,
    `textarea[placeholder='${nameOrId}']`
  ];

  return findVisibleElement(locators, nameOrId);
}

export async function findButtonElement(TypeOrText: string): Promise<WebdriverIO.Element | null> {
  const locators = [
    `a[href*='${TypeOrText}']`,
    `a:contains('${TypeOrText}')`,
    `button[name='${TypeOrText}']`,
    `button[id='${TypeOrText}']`,
    `button[id*='${TypeOrText}']`,
    `button:contains('${TypeOrText}')`
  ];

  return findVisibleElement(locators, TypeOrText);
}

export async function findListElement(elementName: string): Promise<WebdriverIO.Element | null> {
  const locators = [
    `//select[contains(text(),"${elementName}")]`, //Standard select list
    `//div[contains(text(),"${elementName}")]//following::input`  // Find a div with the text above a combobox
  ];

  return findVisibleElement(locators, elementName);
}


export async function findElementByText(elementName, elementType) {
  ASB.set("ELEMENT_FOUND_BY_TEXT", false);
  let newElement: WebdriverIO.Element = null;
  switch (elementType) {
    case "button":
      newElement = await findButtonElement(elementName);
      break
    case "input":
      newElement = await findFieldElement(elementName);
      break;
    case "list":
      newElement = await findListElement(elementName);
      ASB.set("ELEMENT_FOUND_BY_TEXT", newElement !== null);

  }

  return newElement;

}

export async function getValidTelerikElement(
  elementOrString: WebdriverIO.Element | string,
  elementType: string
): Promise<WebdriverIO.Element> {
  let found: Boolean = false;
  let element: WebdriverIO.Element

  // Scroll down until found
  do {
    element = await getValidElement(elementOrString, elementType);

    if (ASB.get("END_OF_PAGE") === true) {
      await log(`  FAIL: Reached bottom of page without finding element "${elementOrString}"`);
      return null;
    }

    found = ASB.get("ELEMENT_EXISTS");
    if (!found) {
      await scrollDown();
    }
  } while (!found);

  return element;
}

export async function getValidElement(
  elementOrString: WebdriverIO.Element | string,
  elementType: string
): Promise<WebdriverIO.Element> {
  let found: boolean = true;
  let element: WebdriverIO.Element;

  let newSelector: string = "";
  let newElement: any = element;

  let elements: WebdriverIO.Element[];
  let normalizedElementType: string = "";
  let elementName: string = "";
  //Find as string 
  let selector: string
  let elementText: string = ""

  // Find elements based on string alone
  if (typeof elementOrString === "string") {


    let initialElementType: string; // Declare initialElementType variable
    let eleText = elementOrString;
    found = false;

    // Any close matches for this text string? 
    // CSS for Input

    switch (elementType) {
      case "button":
        // CSS for Button by type
        // Example: <button type="submit" class="btn btn-primary">Submit</button>
        selector = `button[type='${eleText}']`
        ASB.set("SELECTOR", selector);

        elements = await browser.$$(selector);
        found = elements.length > 0;

        // xPath for Button containing an element that contains text
        // Example: <button class="radius" type="submit"><i class="fa fa-2x fa-sign-in">Login</i></button>
        if (!found) {
          selector = `//button/*[text()='${eleText}']`
          ASB.set("SELECTOR", selector);

        }
        elements = await browser.$$(selector);
        found = elements.length > 0;

        // xPath for Button containing an element that contains text with transient spaces
        // <button class="radius" type="submit"><i class="fa fa-2x fa-sign-in"> Login</i></button>
        if (!found) {
          selector = `//button/*[contains(text(),'${eleText}')]`
          ASB.set("SELECTOR", selector);

        }
        break;

      case "field":
        selector = `input[id='${eleText}']`
        ASB.set("SELECTOR", selector);

        elements = await browser.$$(selector);
        found = elements.length > 0;

        if (!found) {
          selector = `input[name='${eleText}']`
          ASB.set("SELECTOR", selector);

        }
        break;

      case "list":
        selector = `select[id='${eleText}']`
        ASB.set("SELECTOR", selector);

        break;

    }


    elements = await browser.$$(selector);
    found = elements.length > 0;

    if (found) {
      element = elements[0];
    } else {
      // Any close matches for this text string?
      selector = `//*[contains(@id, '${eleText}') 
      or contains(@name, '${eleText}') 
      or contains(@type, '${eleText}') 
      or contains(@href, '${eleText}') 
      or contains(@placeholder, '${eleText}')]`;
      elements = await browser.$$(selector);

      found = elements.length > 0;
      if (found) {
        element = elements[0];
      }

      if (!found) {
        await log(`  FAIL: Did not find ${elements.length} "${eleText}" element with selector "${selector}"`);
        return null;
      }
    }
  } else {
    element = elementOrString;
  }

  /**
   * Find as Element
   * Get a collection of matching elements
   */
  newElement = element;
  selector = newElement.selector
  ASB.set("SELECTOR", selector);

  try {
    elements = await $$(selector);
    if (elements.length === 0) {
      // Extract the element type if not provided
      if (elementType === "") {
        let index: number = selector.indexOf("[");
        normalizedElementType = selector.substring(0, index);
      } else {
        normalizedElementType = normalizeElementType(elementType);
        if (selector.includes("//a")) {
          normalizedElementType = "//a";
        }
      }

      elementName = "";

      // Get the element name from the xpath or CSS selector
      if (selector.startsWith("//") || selector.startsWith("(//")) {

        elementName = selector.match(/=".*"/)[0].slice(2, -1);

      } else {

        // Extract text from CSS selector
        if (selector.includes("'") || selector.includes(`"`)) {

          // Extract 'text' or "text" from CSS selector
          if (selector.includes("'")) {
            const index = selector.indexOf("'");
            elementName = selector.substring(0, selector.indexOf("'", index));
          }

          if (selector.includes(`"`)) {
            const index = selector.indexOf(`"`);
            elementName = selector.substring(0, selector.indexOf(`"`, index));
          }
        } else {
          // Extract .text or #text from CSS selector
          if (selector.startsWith(".") || selector.startsWith("#")) {
            // remove first character of selector
            elementName = selector.substring(1);
          }
        }
      }

      switch (normalizedElementType) {
        case "//a":

          newSelector = `//button[contains(@type,"${elementName}")]`;
          ASB.set("SELECTOR", newSelector);

          break;

        case "//button":

          newSelector = `//a[contains(text(),"${elementName}")]`;
          ASB.set("SELECTOR", newSelector);
          found = await isElementVisible(await $(newSelector));
          break;

        case "//input":


          newSelector = `//input[contains(@id,"${elementName}")]`;
          ASB.set("SELECTOR", newSelector);
          found = await isElementVisible(await $(newSelector));
          if (!found) {
            newSelector = `//input[contains(@name,"${elementName}")]`;
            await isElementVisible(await $(newSelector));
          }
          break;

        case "//select":

          // Find a div with the text above a combobox
          newSelector = `//div[contains(text(),"${elementName}")]//following::input`;
          ASB.set("SELECTOR", newSelector);
          found = await isElementVisible(await $(newSelector));
          break;

        case "//*":

          newSelector = `//*[contains(@id,"${elementName}")]`;
          ASB.set("SELECTOR", newSelector);
          found = await isElementVisible(await $(newSelector));
          break;

        default:
          found = false;
          break;
      }

      newElement = await $(newSelector);
      found = await isElementVisible(newElement);
      // Successful class switch
      if (found) {
        await log(
          `  WARN: Replaced selector "${selector}" \n                   with selector "${newSelector}"`
        );
      }
    }
  } catch (error) {
    found = false;
  }

  if (!found) {
    await log(`  ERROR: Unable to find selector "${selector}" class switched as selector "${newSelector}"`);
  } else {
    highlightOn(newElement) // Highlight the element
  }
  // set switchboard find success
  ASB.set("ELEMENT_EXISTS", found)

  return newElement;
}


async function getElementType(element: WebdriverIO.Element) {
  // get from existing element
  let tagName = await element.getTagName();
  if (tagName === null) {
    // get from non existing element instead of null
    let selector = element.selector.toString();
    let startIndex = selector.indexOf("\\") + 1;
    let endIndex = selector.indexOf("[");
    tagName = selector.substring(startIndex, endIndex);
  }
  return tagName;
}


/**
* Returns the first non-null property from the prioritized list: 'name', 'placeholder', 'area-label'.
* if the Element class is an input field, the parent div text is returned.
* @param {WebdriverIO.Element} element - The WebdriverIO element to get the name of the field
* @returns {string | null} The field name, or null if no properties have a value
*/

async function getFieldName(element: WebdriverIO.Element) {

  // Get the 'name' property of the element
  const name = await element.getAttribute("name");
  if (name) return name;

  // Get the 'placeholder' property of the element
  const placeholder = await element.getAttribute("placeholder");
  if (placeholder) return placeholder;

  // Get the 'type' property of the element
  const type = await element.getAttribute("type");
  if (type) return type;

  // Return the 'class' property of the element if others are empty
  const className = await element.getAttribute("class");

  if (className == "input") {  // combobox
    // Find the first parent div element using XPath
    const parentDivElement = await element.$('ancestor::div[1]');
    return await parentDivElement.getText();
  }
  return className;
}

async function getListName(element: WebdriverIO.Element) {

  // Get the 'name' property of the element
  const ariaLable = await element.getAttribute("aria-label");
  if (ariaLable) return ariaLable;

  // Get the 'name' property of the element
  const name = await element.getAttribute("aria-label");
  if (name) return name;

  // Get the 'id' property of the element
  const id = await element.getAttribute("id");
  if (id) return id;

  // Get the 'type' property of the element
  const type = await element.getAttribute("type");
  if (type) return type;

  // Return the 'class' property of the element if others are empty
  const className = await element.getAttribute("class");
  return className;
}

/**
 * Returns the current date plus or minus a specified number of days in a specified format.
 * @param offset  Number of days to add or subtract from the current date. Default is 0.
 * @param format The format of the returned date string. Default is "yyyy-MM-dd".
 * @return The current date plus or minus the specified number of days in the specified format.
 Format options:
 "yyyy" or "yy" - to represent the 4 or 2 digit year, respectively.
 "MM" or "M" - to represent the month with leading zero or without leading zero respectively
 "dd" or "d" - to represent the date with leading zero or without leading zero respectively
 
 // helpers.log(getToday());  // returns current date in MM-dd-yyyy format
 // helpers.log(getToday("+5", "d/M/yyyy"));  // returns current date plus 5 days in d/M/yyyy format
 // helpers.log(getToday("-3", "yyyy/MM/dd"));  // returns current date minus 3 days in yyyy/MM/dd format
 */
export function getToday(offset: number = 0, format: string = "dd-mm-yyyy") {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + offset);
  return currentDate.toLocaleDateString(undefined, {
    year: format.includes("yyyy") ? "numeric" : undefined,
    month: format.includes("mm")
      ? "2-digit"
      : format.includes("m")
        ? "numeric"
        : undefined,
    day: format.includes("dd")
      ? "2-digit"
      : format.includes("d")
        ? "numeric"
        : undefined,
  });
}

export async function highlightOn(
  element: WebdriverIO.Element,
  color: string = "green"
): Promise<boolean> {
  let ELEMENT_SELECTOR: any;
  let visible: boolean = true;
  try {
    ELEMENT_SELECTOR = await element.selector;
    try {
      await browser.execute(
        `arguments[0].style.border = '5px solid ${color}';`,
        element
      );
      visible = await isElementVisible(element);
    } catch (error: any) {
      // Handle stale element
      const newElement = await browser.$(ELEMENT_SELECTOR);
      ASB.set("element", newElement);
      ASB.set("staleElement", true);
      await browser.execute(
        `arguments[0].style.border = '5px solid ${color}';`,
        newElement
      );
    }
  } catch (error) {
    // Element no longer exists
    visible = false;
  }
  return visible;
}

export async function highlightOff(
  element: WebdriverIO.Element
): Promise<boolean> {
  let visible: boolean = true;
  try {
    await browser.execute(`arguments[0].style.border = "0px";`, element);
  } catch (error) {
    // Element no longer exists
    visible = false;
  }
  return visible;
}

export async function isElementVisible(
  element: WebdriverIO.Element
): Promise<boolean> {
  try {
    const displayed = await element.isDisplayed();
    return displayed;
  } catch (error) {
    return false;
  }
}
function isEmpty(text: string | null): boolean {
  if (!text || text === "") {
    return true;
  }
  return false;
}

export async function isElementInViewport(
  element: WebdriverIO.Element
): Promise<boolean> {

  // This statement returns true if the element off the top of the the viewport
  let isInViewport = true
  let viewportHeight = (await browser.getWindowSize()).height
  let y = await element.getLocation("y");
  let x = await element.getLocation("x");
  //if the element y is between 0 and the viewport height, it is in the viewport
  if ((y < 0) || (y > viewportHeight)) {
    isInViewport = false;
  } else {
    isInViewport = await isElementVisible(element);
  }

  return isInViewport;
}

async function isExists(element: WebdriverIO.Element) {
  try {
    return await element.isExisting();
  } catch (error) {
    return false;
  }
}

/**
 * Console.log wrapper
 *    - Does not print if string is empty / null
 *    - Prints trace if not passed string or number
 * @param message
 */

const ANSI_PASS = `\x1b[38;2;0;255;0m` // GREEN
const ANSI_FAIL = `\x1b[38;2;255;0;0m`    // RED
const ANSI_WARNING = `\x1b[38;2;255;255;0m`  // YELLOW
const ANSI_LOCATOR = `\x1b[38;2;200;150;255m`  // Light Purple
const ANSI_STRING = `\x1b[38;2;173;216;230m`  // Light Blue TEXT entered into a field
const ANSI_TEXT = `\x1b[97m`  // White TEXT
const ANSI_RESET = `\x1b[0m` //Reset
ASB.set("ANSI_COLOR", ANSI_RESET);
let LAST_MESSAGE: string = "";
let LAST_MESSAGE_COUNT: number = 0;
ASB.set("LAST_MESSAGE_COUNT", 0);
ASB.set("LAST_MESSAGE", "");

export async function log(message: any): Promise<void> {
  //Skip repeated messages

  LAST_MESSAGE = ASB.get("LAST_MESSAGE");
  LAST_MESSAGE_COUNT = ASB.get("LAST_MESSAGE_COUNT");

  if (LAST_MESSAGE === message) {

    ASB.set("LAST_MESSAGE_COUNT", LAST_MESSAGE_COUNT++);
    return;
  }

  if (LAST_MESSAGE_COUNT > 0) {
    console.log(`   └ ─ >   This message repeated ${LAST_MESSAGE_COUNT} times`);
    ASB.set("LAST_MESSAGE_COUNT", 0);
  }

  ASB.set("LAST_MESSAGE", message);

  // Append a space to the message to allow regex to work correcty
  let messageString: string = message + " ";

  try {
    if (typeof message === "string" || typeof message === "number") {
      if (message) {

        if (messageString.toString().includes(`[object Promise]`)) {
          messageString = (`--->  WARN: ${message} \n      Promise object detected. async function call missing await keyword.`);
          console.trace();
        }

        if (messageString.includes("WARN: ")) {
          messageString = ANSI_WARNING + messageString + " " + ANSI_RESET
          ASB.set("ANSI_COLOR", ANSI_WARNING);
        } else if (messageString.includes("FAIL: ") || messageString.includes("ERROR: ") || messageString.includes("Promise")) {
          messageString = ANSI_FAIL + messageString + " " + ANSI_RESET
          ASB.set("ANSI_COLOR", ANSI_FAIL);
        } else if (messageString.includes("PASS: ")) {
          // PASS
          messageString = ANSI_PASS + message + " "
          ASB.set("ANSI_COLOR", ANSI_PASS);
        } else {
          messageString = ANSI_TEXT + message + " " + ANSI_RESET
          ASB.set("ANSI_COLOR", ANSI_RESET);
        }

        //Send colored content to Debug console
        //Highlight CSS and XPath selectors in Purple case-insensitive to 'Selector' and 'selector'
        // Set case ignore flag (i) and global flag (g) to replace all instances
        let regex = /Selector ['"](.*?)['"] /ig;

        if (regex.test(messageString)) {
          regex.lastIndex = 0; // Reset the regex index to make multiple passes
          messageString = messageString.replace(regex, `selector "${ANSI_LOCATOR}$1${ASB.get("ANSI_COLOR")}" `);

        } else {
          // Highlight accent marks, single and double quoted strings surrounded in spaces in Blue
          messageString = messageString.replace(/ `([^`]+)` /g, ` \`${ANSI_STRING}$1${ASB.get("ANSI_COLOR")}\` `);
          messageString = messageString.replace(/ '([^`]+)' /g, ` '${ANSI_STRING}$1${ASB.get("ANSI_COLOR")}' `);
          messageString = messageString.replace(/ "([^"]+)" /g, ` "${ANSI_STRING}$1${ASB.get("ANSI_COLOR")}" `);
        }
        console.log(`--->   ${messageString} ${ANSI_RESET}`);
      }
    }
  } catch (error: any) {
    console.log(`--->   helpers.console(): ${error.message}`);
  }
}

/**
 * Masks the middle of the string with asterisks
 * @param str unmasked string
 * @returns masked string
 * let originalString = 'SuperSecretPassword!';
 * let maskedString = maskString(originalString);
 * console.log(originalString); // Output: 'SuperSecretPassword!'
 * console.log(maskedString); // Output: 'Su****************d!'
 */
function maskValue(str: string): string {
  return str.slice(0, 2) + str.slice(2, -2).replace(/./g, '*') + str.slice(-2);
}

function maskPassword(password: string): string {
  return password.replace(
    /^(.{2})(.*)(.{2})$/,
    "$1" + "*".repeat(password.length - 4) + "$3"
  );
}

function normalizeElementType(elementType: string) {
  // Pessimistic: return all elements if explicit type is unknown
  let elementText = "//*";

  switch (elementType) {
    case "link":
      elementText = "//a";
      break;
    case "button":
      elementText = "//button";
      break;
    case "field":
    case "input":
      elementText = "//input";
      break;
    case "list":
      elementText = "//select";
      break;
    case "text":
      elementText = "//p";
      break;
    default:
      global.log(`WARN: Unable to normalize element type ${elementType}`);
  }
  return elementText;
}

/**
 * pageSync - Dynamic wait for the page to stabilize.
 * Use after click
 * ms = default time wait between loops 125 = 1/8 sec
 *      Minimum 25 for speed / stability balance
 */
let LAST_URL: String = "";

export async function pageSync(
  ms: number = 25,
  waitOnSamePage: boolean = false
): Promise<boolean> {
  await waitForSpinner();

  // Pessimistic result
  let result = false;
  let skipToEnd = false;

  // @ts-ignore
  let thisUrl = await browser.getUrl();

  if (waitOnSamePage === false) {
    if (thisUrl === LAST_URL) {
      //skip rest of function
      result = true;
      skipToEnd = true;
    }
  }

  if (skipToEnd === false) {
    LAST_URL = thisUrl;
    let visibleSpans: string = 'div:not([style*="visibility: hidden"])';
    let elements = await $$(visibleSpans);
    let exit: boolean = false;
    let count: number = elements.length;
    let lastCount: number = 0;
    let retries: number = 3;
    let retry: number = retries;
    let timeout: number = 5000; // 5 second timeout
    const startTime: number = Date.now();

    while (retry > 0) {
      if (lastCount != count) {
        retry = retries; // Reset the count of attempts
      }

      // Exit after 3 stable element counts
      if (retry == 0) {
        break;
      }

      if (timeout-- === 0) {
        await log("Page never settled");
        exit = true;
        break;
      }

      lastCount = count;

      // wait 1/4 sec before next count check
      await pause(ms);

      try {
        elements = await $$(visibleSpans);
      } catch (error: any) {
        exit = true;
        switch (error.name) {
          case "TimeoutError":
            await log(`ERROR: Timed out while trying to find visible spans.`);
            break;
          case "NoSuchElementError":
            await log(`ERROR: Could not find any visible spans.`);
            break;
          default:
            if (error.message === `Couldn't find page handle`) {
              await log(`WARN: Browser closed. (Possibly missing await)`);
            }
        }
        // Error thrown: Exit loop
        break;
      }

      count = await elements.length;
      retry--;
    }

    // Metric: Report if the page took more than 3 seconds to build
    const endTime = Date.now();
    const duration = endTime - startTime;

    if (duration > timeout) {
      await log(
        `  WARN: pageSync() completed in ${duration / 1000
        } sec  (${duration} ms) `
      );
    } else {
      //log(`  pageSync() completed in ${duration} ms`); // Optional debug messaging
    }
  }
  return result;
}

export async function setValueAdvIfExists(element: WebdriverIO.Element) {
  ASB.set(IF_EXISTS, true);
  let result = await this.setValueAdv(element);
  ASB.set(IF_EXISTS, false);
  return result;
}

// "Ham wrapped in Bacon"
// Allows for a quick revert to the original function
// await setValueAdv(await fldFirstName, "Gene"); // Uses full framework
// await setValue(await fldFirstName, "Gene"); // Uses minimal or no framework support
export async function setValue(
  inputField: WebdriverIO.Element | string,
  item: string
): Promise<void> {
  //@ts-ignore
  if (typeof inputField === "string") {
    // Partial framework solution Find the element as a xpath, CSS or text selector
    inputField = await $(await getValidElement(inputField, "field"));

    // This is the non-framework option
    // this.log (`FAIL: The standard setValue() function only supports WebdriverIO elements.\r\n{$element} is a string. Use setValue(strObject, item) instead.`)
  }
  return await (inputField.selectByVisibleText(item));
}

export async function setValueAdv(
  inputField: WebdriverIO.Element | string,
  text: string
): Promise<boolean> {
  let success: boolean = false;

  // Take an string or element and return a valid element - set EXISTS in the switchboard
  inputField = await getValidElement(inputField, "field");


  const SELECTOR = inputField.selector.toString();

  let newValue: string = replaceTags(text);
  let scrubbedValue: string = newValue
  let fieldName: string = await getFieldName(inputField)

  //Mask Passwords in output
  if (fieldName.includes("ssword")) {
    scrubbedValue = maskValue(scrubbedValue)
  }

  await log(`Entering "${scrubbedValue}" into selector "${SELECTOR}"`);

  try {
    //await element.waitForDisplayed();

    if (!(await isElementInViewport(inputField))) {
      await scrollIntoView(inputField);
      await waitForElementToStopMoving(inputField, 2000);
    }

    await highlightOn(inputField);

    //Check if text was entered
    // Clear input field
    await inputField.click();

    // Clear the field.
    await inputField.setValue("");

    // Check for accuracy
    if (!(await inputField.getValue()).includes(text)) {
      await inputField.setValue("");
      // Send text to input field character by character
      for (const letter of text) {
        await inputField.addValue(letter);
      }
    }

    success = true;
  } catch (error: any) {

    if (ASB.get(IF_EXISTS) === true) {
      await log(`  WARN: setValueAdvIfExists - Skipped entering "${scrubbedValue}" in selector "${SELECTOR}" without failing the test`);
      ASB.set(IF_EXISTS, false)
      return true;

    } else {

      await log(
        `  ERROR: ${SELECTOR} was not populated with "${scrubbedValue}".\n       ${error.message}`
      );
      // Throw the error to stop the test, still masking password
      await inputField.setValue(scrubbedValue);
    }
  }
  return success;
}

/**
 * Wrapper for browser.pause
 * @param ms reports if wait is more than 1/2 second
 */
export async function pause(ms: number) {
  if (ms > 500) {
    await log(`  Waiting ${ms} ms...`); // Custom log
  }

  const start = Date.now();
  let now = start;
  while (now - start < ms) {
    now = Date.now();
  }
}

let TAGS: string[];

function replaceTags(text: string) {
  //check if the passed tag is in the format of "<someTag>"
  let newText: string = text;
  // Capture anything that is not a space
  let match = newText.match(/\<(.*?)\>/);

  while (match) {
    let tag = match[0].toLowerCase();
    let tagType = match[1].toLowerCase();

    switch (true) {
      case tag.includes("<today"):
        let format: string = tagType.split(" ")[1] ? tagType.split(" ")[1] : "";
        let days: number = 0;

        const match = tag.match(/[+-](\d+)/);
        if (match) {
          const days = parseInt(match[0]);
        }

        newText = newText.replace(tag, getToday(days, format));
        break;

      default:
        log(`ERROR: Unknown tag <${tag}>`);
        break;
    }
    match = newText.match(/\<(.*?)\>/);
  }

  if (newText !== text) {
    log(`    Replaced tags in '${text}' with '${newText}'`);
  }
  return newText;
}

export async function scrollIntoView(element: WebdriverIO.Element) {
  await highlightOn(element);
  await element.scrollIntoView({ block: "center", inline: "center" });

  let viewportHeight = (await browser.getWindowSize()).height
  let lastY = 0;

  while (await isElementInViewport(element) === false) {
    // Check if object scrolled off the top of the page
    await waitForElementToStopMoving(element, 2000);

    let elementY = await getElementY(element);

    if (elementY < 0) {
      // scolls down and sets END_OF_PAGE if the element is at the bottom of the page
      scrollDown();
      // exit if the element is in the top 1/3 of the viewport
      if (elementY < (viewportHeight / 3)) {
        break;
      }
    } else {
      // Scrolls up and sets END_OF_PAGE if the element is at the top of the page
      scrollUp();
      // exit if the element is in the top 1/3 of the viewport
      if (elementY > (viewportHeight / 3)) {
        break;
      }
    }

    // exit if the element never moved
    if (ASB.get("END_OF_PAGE") || (lastY === elementY)) {
      break;
    }

    lastY = elementY;
  }
  await highlightOff(element);
}

// Get the Y coordinate of the element to determin if the scroll command worked
export async function getElementY(element: WebdriverIO.Element)
  : Promise<number> {

  let rect = await browser.execute(function (el) {
    return (el as unknown as HTMLElement).getBoundingClientRect();
  }, element);

  return rect.y;
}

export async function scrollDown(scrollValue = 100) {
  await browser.execute(`window.scrollBy(0, ${scrollValue})`);
  await isEndOfPage();
}

export async function scrollUp(scrollValue = 100) {
  await browser.execute(`window.scrollBy(0, -${scrollValue})`);
  await isEndOfPage();
}

export async function isEndOfPage() {
  ASB.set("END_OF_PAGE", false);

  let y = await $('//*').getLocation("y");
  if (ASB.get("LAST_Y") === y) {
    ASB.set("END_OF_PAGE", true);
  } else {
    ASB.set("LAST_Y", y)
  }
}



export async function sleep(ms: number) {
  await log(`Waiting ${ms} ms...`);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// "Ham wrapped in Bacon"
// Allows for a quick revert to the original function
// await selectAdv(await lstMonth, "January"); // Uses full framework
// await select(await lstMonth, "January"); // Uses minimal or no framework support
export async function select(
  listElement: WebdriverIO.Element | string,
  item: string
): Promise<void> {
  //@ts-ignore
  if (typeof listElement === "string") {
    // Partial framework solution Find the element as a xpath, CSS or text selector
    listElement = await $(await getValidElement(listElement, "list"));

    // This is the non-framework option
    // this.log (`FAIL: The standard select() function only supports WebdriverIO elements.\r\n{$element} is a string. Use selectAdv(strObject, item) instead.`)
  }
  return await (listElement.selectByVisibleText(item));
}



export async function waitForSpinner(): Promise<boolean> {
  let spinnerDetected: boolean = false;
  // This spinner locator is unique to each project
  const spinnerLocator: string = `//img[contains(@src,'loader')]`;
  await pause(100); // Let browser begin building spinner on page
  let spinner = await browser.$(spinnerLocator);
  let found = await highlightOn(spinner);
  let timeout = ASB.get("spinnerTimeoutInSeconds");
  const start = Date.now();
  if (found) {
    const startTime = performance.now();
    // display this message in yellow
    await log(
      `  ${ANSI_WARNING}Spinner detected...`)

    spinnerDetected = true;
    try {
      while (found) {
        found = await highlightOn(spinner);
        if (!found) break;
        await pause(100);
        found = await highlightOff(spinner);
        if (!found) break;
        await pause(100);
        if (Date.now() - start > timeout * 1000) {
          // custom log automatically displays this in red in console
          await log(`  ERROR: Spinner did not close after ${timeout} seconds`);
          break;
        }
      }
    } catch (error) {
      // Spinner no longer exists
    }

    // Optional: Display a spinner completion message in Green in the console.
    await log(
      `  ${ANSI_PASS}Spinner Elapsed time: ${Math.floor(performance.now() - startTime)} ms (${Math.round((performance.now() - startTime) / 1000)} sec)`
    );

  }

  return spinnerDetected;
}

export async function selectAdvIfExists(element: WebdriverIO.Element) {
  ASB.set(IF_EXISTS, true);
  let result = await this.selectAdv(element);
  ASB.set(IF_EXISTS, false);
  return result;
}



export async function selectAdv(
  listElement: WebdriverIO.Element | string,
  item: string
): Promise<boolean> {
  let success: boolean = false;
  let itemValue: String = "No Item selected"
  let listItems: WebdriverIO.Element[]
  let textContent: string = " "

  // Empty item list - do nothing
  if (item.length === 0) {
    await log(`  ERROR: ${listElement} had no list item passed.\n`);
    return true;
  }

  //Get a valid list element
  //const validListElement = await getValidElement(listElement as WebdriverIO.Element, "list");
  const validListElement = await getValidElement(listElement, "list");
  await scrollIntoView(validListElement);
  // Get the name of the element

  let selector = validListElement.selector.toString()
  let isXPath = selector.includes("//");


  if (!isXPath) {
    let cssSelector = selector
    let xpath = await browser.execute(function (cssSelector) {
      let element = document.querySelector(cssSelector);
      let xpath = '';
      //@ts-ignore - TS does not like the element variable, but this works
      for (; element && element.nodeType == 1; element = element.parentNode) {
        let id = Array.prototype.indexOf.call(element.parentNode.childNodes, element) + 1;
        id > 1 ? (id = '[' + id + ']') : (id = '');
        xpath = '/' + element.tagName + id + xpath;
      }
      return xpath;
    }, cssSelector);
    selector = xpath;
  }
  // Comboboxes look like input fields
  let isCombobox = selector.toLowerCase().includes("/input");

  //Scroll into view if not inside the virtual viewport
  if (!(await isElementInViewport(validListElement))) {
    await scrollIntoView(validListElement);
    await waitForElementToStopMoving(validListElement, 3000);
  }

  if (isCombobox) {
    //@ts-ignore
    await listElement.doubleClick() //Selects all the text in the combobox


    // Allow user to pass a number like 3 for March
    if (typeof (item) === 'number') {

      // Try number select
      const index: number = item;
      try {
        await (await $(`//span[normalize-space()='${item}']`)).click();
        await browser.pause(125) // Wait for box to open
        itemValue = await validListElement.getText();
        // Report actual item selected
        global.log(`  Item selected: "${itemValue}"`)
        success = true;
      } catch (error: any) {

        if (ASB.get(IF_EXISTS) === true) {
          await log(`  WARN: SelectAdvIfExists - Skipped selecting "${item}" in combobox selector \`${ASB.get("ELEMENT_SELECTOR")}\` without failing the test`);
          ASB.set(IF_EXISTS, false)
          return true;
        }

        await log(`  ERROR: ${listElement} could not select "${item}" was not selected\n
        ${error.message}`);
      }
    } else {
      // Clear the field.
      await validListElement.click() // Select All Clear Mac and Windows
      await browser.keys(['Home']);
      await browser.keys(['Shift', 'End']);
      await browser.keys(['Delete']);
      await browser.keys(`${item}`)

      await browser.pause(300); // Wait for the list to expand

      // Find the item in the list
      let items: string[] = []; // List of strings in the combobox
      let found = false;
      try {
        listItems = await browser.$$(`//li/*`)

        for (const listItem of listItems) {
          highlightOn(listItem) // Highlight the element
          items.push(await listItem.getText())

          if ((await listItem.getText()).includes(item)) {  // Found the element
            found = true
            break;
          }
          highlightOff(listItem) // Highlight the element
        }


      } catch (error) {
        // no such item
        if (ASB.get(IF_EXISTS) === true) {
          await log(`  WARN: SelectAdvIfExists - Skipped selecting "${item}" in selector "${ASB.get("ELEMENT_SELECTOR")}" without failing the test`);
          ASB.set(IF_EXISTS, false)
          return true;
        }

        listItems = await browser.$$(`//li/*`)
        for (const listItem of listItems) {
          textContent += await listItem.getText() + " | "; // Get the text content of the element
        }
        await log(`  ERROR: "${item}" was not found in combobox: \n ${textContent}`)
      }
      await browser.keys('Enter');
    }

  } else {

    try {
      // Get the list of options in the select element
      const optionsList: string = await getListValues(validListElement);
      console.log(optionsList); // This will print the list of options text in the select element

      if (typeof (item) === 'number') {
        const index: number = item;
        await (await validListElement).selectByIndex(index);
      } else {
        await (await validListElement).selectByVisibleText(item)
      }
      global.log(`  Item selected: "${item}"`)
      success = true;
    } catch (error: any) {
      if (ASB.get(IF_EXISTS) === true) {
        await log(`  WARN: SelectAdvIfExists - Skipped selecting item number "${item}" in selector "${ASB.get("ELEMENT_SELECTOR")}" without failing the test`);
        ASB.set(IF_EXISTS, false)
        return true;
      }
      await log(`  ERROR: ${listElement} could not select "${item}"\n
      ${error.message}`);
    }

  }
  return success;
}

//Resolves stale element
export async function refreshElement(
  element: WebdriverIO.Element
): Promise<WebdriverIO.Element> {
  return await browser.$(element.selector);
}

async function findElement(selector: string): Promise<WebdriverIO.Element> {
  try {
    return await browser.$(selector);
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('stale')) {
        // Element is stale, so we need to recreate it
        return await browser.$(selector);
      }
    }
    throw error;
  }
}

export async function getListValues(selectElement: WebdriverIO.Element
): Promise<string> {

  const optionElements = await (await selectElement).getText();
  return optionElements;
}

export async function waitForElementToStopMoving(element: WebdriverIO.Element, timeout: number): Promise<void> {

  const initialLocation = await element.getLocation();

  return new Promise((resolve, reject) => {
    let intervalId: NodeJS.Timeout;

    const checkMovement = () => {
      element.getLocation().then((currentLocation) => {
        if (
          currentLocation.x === initialLocation.x &&
          currentLocation.y === initialLocation.y
        ) {
          clearInterval(intervalId);
          resolve();
        }
      });
    };

    intervalId = setInterval(checkMovement, 100);

    setTimeout(() => {
      clearInterval(intervalId);
      reject(new Error(`Timeout: Element did not stop moving within ${timeout}ms`));
    }, timeout);
  });
}

/**
 * This is the function for doign asserts and passing the results to the allure report
 * @param actual
 * @param assertionType
 * @param expected
 */
// export async function expectAdv(actual:  WebdriverIO.Element | string, assertionType: any, expected: any) {
//   const softAssert = expect;

//   // Convert "does not exist" to "doesNotExist"
//   let originalAssertionType = assertionType;
//   assertionType = assertionType.replace(/\s+/g, "").toLowerCase();

//   const getAssertionType = {
//     equals: () => (softAssert(actual).toEqual(expected)),
//     contains: () => (softAssert(actual).toContain(expected)),

//     exists: () => ( softAssert(actual).toBeExisting()),

//     isenabled: () => (softAssert(actual).toBeEnabled()),
//     isdisabled: () => (softAssert(actual).toBeDisabled()),
//     doesnotexist: () => (softAssert(actual).not.toBeExisting()),
//     doesnotcontain: () => (softAssert(actual).not.toContain(expected)),
//     tohavetextcontaining: () => (softAssert(actual).toHaveTextContaining(expected)),
//     containstext: () => (softAssert(actual).toHaveTextContaining(expected)),

//     default: () => {
//       log(`WARN: Invalid assertion type: "${assertionType}" \r\n  Valid assertion types are: "equals", "contains", "exists", "is enabled", "is disabled", "does not exist", "does not contain", "to have text containing", "contains text"`);
//       // Throws an error if the assertion type is not valid
//       throw new Error(`Invalid assertion type: "${originalAssertionType}" \r\n  Valid assertion types are: "equals", "contains", "exists", "is enabled", "is disabled", "does not exist", "does not contain", "to have text containing", "contains text"`);
//     },
//   };

//   try {
//     (await getAssertionType[assertionType] || await getAssertionType['default'])();
//     allureReporter.addAttachment(`Assertion Pass: `, `"${actual}" ${originalAssertionType} "${expected}"`, 'text/plain');

//   if (typeof actual === 'string') {
//     this.log(`PASS: =======>>>>>>>>>>> "${actual}" ${originalAssertionType} "${expected}"`);
//   } else {
//     this.log(`PASS: =======>>>>>>>>>>> ${await actual.locator} element ${originalAssertionType} ${expected}`);
//   }

//   } catch (error) {
//     this.log(`FAIL: assertion type failure : =======>>>>>>>>>>>  ${actual} ${originalAssertionType} ${expected} : ${error}`);
//     allureReporter.addAttachment('Assertion Failure: ', `Invalid Assertion Type = ${originalAssertionType}`, 'text/plain');
//     allureReporter.addAttachment('Assertion Error: ', error.toString(), 'text/plain');
//   } finally {
//   //  allureReporter.addAttachment('Assertion Passes: ', `Valid Assertion Type = ${assertionType}`, 'text/plain');
//   //  this.log('Assertion  PASS: =======>>>>>>>>>>> ', assertionType);
//     allureReporter.endStep();
//   }

//   // For the full list of options please got to
//   // https://github.com/webdriverio/expect-webdriverio/blob/main/docs/API.md
// }

/**
 * This is the function for performing asserts and passing the results to the allure report
 * @param actual
 * @param assertionType
 * @param expected
 */
export async function expectAdv(actual: WebdriverIO.Element | string, assertionType: any, expected: any = null) {

  // Stub out assertions if the test has already ended
  if (!ASB.get("TEST_ENDED")) {

    let failed: boolean = false;
    let errorMessage: string = "";

    //Jest expect function
    const softAssert = expect;

    // Convert assertions like "Does not exist" to "doesnotexist"
    let originalAssertionType = assertionType;
    assertionType = assertionType.replace(/\s+/g, "").toLowerCase();

    const getAssertionType = {
      // perform the assertion 
      equals: async () => (await softAssert(actual).toEqual(expected)),
      contains: async () => (await softAssert(actual).toContain(expected)),
      exists: async () => (await softAssert(actual).toBeExisting()),
      doesexist: async () => (await softAssert(actual).toBeExisting()),
      doesnotexist: async () => (await softAssert(actual).not.toBeExisting()),

      isenabled: async () => (await softAssert(actual).toBeEnabled()),
      isnotdisabled: async () => (await softAssert(actual).toBeEnabled()),

      isnotenabled: async () => (await softAssert(actual).not.toBeEnabled()),
      isdisabled: async () => (await softAssert(actual).toBeDisabled()),

      doesnotcontain: async () => (await softAssert(actual).not.toContain(expected)),
      tohavetextcontaining: async () => (await softAssert(actual).toHaveTextContaining(expected)),
      containstext: async () => (await softAssert(actual).toHaveTextContaining(expected)),
      default: async () => {
        allureReporter.addAttachment('Assertion Failure: ', `Invalid Assertion Type = ${originalAssertionType}`, 'text/plain');
        await log(`WARN: Invalid assertion type: "${assertionType}" \r\n  Valid assertion types are: "equals" "contains" "exists" "is enabled" "is disabled" "does not exist" "does not contain" "to have text containing" "contains text"`);
        throw new Error(`Invalid assertion type: "${originalAssertionType}"`);
      },
    };



    try {

      // if expected is nothing, then we are checking for the state of an element
      // otherwise we are comparing value of two strings

      if (await expected === null) {
        // Take a string or element and return a valid element - set EXISTS in the switchboard
        if (typeof actual === 'string') {
          actual = await getValidElement(actual, "");
        }

        if (actual.error.message.includes(`no such element`)) {

          // If the assertion type is "does not" then the element should not exist
          if (!assertionType.includes(`not`)) {
            //await this.log(`FAIL:  Assert selector "${ASB.get("ELEMENT_SELECTOR")}" ${originalAssertionType} `);
            ASB.set("ALREADY_FAILED", true);
            failed = true
            errorMessage = actual.error.message
          }
        }
      }

      // perform the assertion or report an unknown assertion type
      (await getAssertionType[assertionType] || await getAssertionType['default'])();

      if (failed) {
        allureReporter.addAttachment(`Assertion Fail: `, `"${actual}" ${originalAssertionType} "${expected}"`, 'text/plain');
        throw new Error(`${errorMessage}`);  // Re-throw the error to ensure test failure
      } else {

        allureReporter.addAttachment(`Assertion Pass: `, `"${actual}" ${originalAssertionType} "${expected}"`, 'text/plain');
        // Additional logging for passed assertions
      }

      if (typeof actual === 'string') {
        await this.log(`PASS:  "${actual}" ${originalAssertionType} "${expected}"`);
      } else {
        //@ts-ignore - TS does not like the element.locator, but this works

        await this.log(`PASS:  Verified selector "${ASB.get("ELEMENT_SELECTOR")}" ${originalAssertionType} `);

        await this.log(`********* Error: ${await actual.error.message}`);

      }

    } catch (error) {

      if (await expected === null) {
        // This is an element state check

        await this.log(`FAIL: Object assertion - Expected: selector "${ASB.get("ELEMENT_SELECTOR")}" ${originalAssertionType}\r\n       Actual - ${error}`);
        allureReporter.addAttachment('Object assertion Error: "${ASB.get("ELEMENT_SELECTOR")}" ${originalAssertionType} ', error.toString(), 'text/plain');

      } else {
        // This was a string comparison

        //@ts-ignore - TS does not like the element.locator, but this works
        await this.log(`FAIL: String assertion error : "${actual}" ${originalAssertionType} "${expected}"\r\n       ${error}`);
        allureReporter.addAttachment(`String assertion Error: ${actual}}" ${originalAssertionType} `, error.toString(), 'text/plain');

      }

      // softassert will not throw an error until the end of the test
      // throw error; // Re-throw the error to stop test failure

    } finally {
      allureReporter.endStep();
    }
  }
}



/**
 * Gets last segment of current URL after splitting by "/".
 * @returns {Promise<string>} The last URL segment.
 */
export async function getPageName(): Promise<string> {
  const currentURL = await browser.getUrl();
  const urlSegments = currentURL.split('/');
  return urlSegments[urlSegments.length - 1];
}


/**
 * Parses a string of key-value pairs and updates the SwitchBoard state with those values.
 * Each pair within the testData string should be separated by spaces, and
 * keys/values should be separated by an '=' character.
 *
 * For example, a string "guests=2 zipcode=12345" will result in ASB having
 * "guests" set to 2 and "zipcode" set to 12345.
 *
 * @param {string} testData - The string containing key-value pairs to be parsed.
 */

export function parseToASB(testData: string) {

  const regex = /(\w+)=("([^"]*)"|\b\w+\b)/g;
  let match;

  while ((match = regex.exec(testData)) !== null) {
    let key = match[1];
    let value = match[2];

    // Remove quotes if present
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    // Always save value as a string
    ASB.set(key.toLowerCase(), value);

    console.log(`ASB("${key.toLowerCase()}") set to "${ASB.get(key.toLowerCase())}"`);
  }
}


function getElementTypeFromSelector(selector: string) {
  let locatorType: 'xpath' | 'css';
  let elementType: string;

  // XPath selectors start with // or .//
  if (selector.startsWith(`//`) || selector.startsWith(`.//`) || selector.startsWith(`\(`)) {
    locatorType = 'xpath';
    // Extract the element type from the XPath
    elementType = selector.split('[')[0];
  } else {
    locatorType = 'css';
    // Return Generic xPath selector for CSS
    elementType = `\\*`;
  }

  ASB.set('locatorType', locatorType);

  return elementType;
}
