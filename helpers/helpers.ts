import { ASB } from "./globalObjects";
import allureReporter from "@wdio/allure-reporter";

const IF_EXISTS = "IF_EXISTS";
export async function clickAdvIfExists(element: WebdriverIO.Element) {
  ASB.set(IF_EXISTS, true);
  let result = await this.clickAdv(element);
  ASB.set(IF_EXISTS, false);
  return result;
}

export async function clickAdv(element: WebdriverIO.Element) {
  let success: boolean = false;

  element = await getValidElement(element, "button");
  const SELECTOR = element.selector;
  await log(`Clicking selector '${SELECTOR}'`);
  try {
    if (!(await isElementInViewport(element))) {
      await scrollIntoView(element);
      await waitForElementToStopMoving(element, 1000);
    }
    await highlightOn(element);
    //@ts-ignore
    await element.click(); // ({ block: "center" });
    await pageSync();
    success = true;
    await log(`  PASS: Selector '${SELECTOR}' was clicked!`);
  } catch (error: any) {

    if (ASB.get(IF_EXISTS) === true) {
      await log(`  WARN: ClickIfExists - Skipped clicking selector '${SELECTOR}' without failing the test`);
      ASB.set(IF_EXISTS, false)
      return true;

    } else {
      await log(`  FAIL: Selector '${SELECTOR}' was not clicked.\n       ${error.message}`);
      expect(SELECTOR).toEqual('to be clickable');
      // Throw the error to stop the test
      //@ts-ignore
      await element.click() // ({ block: "center" });
    }
  }

  return success;
}

export async function getValidElement(
  element: WebdriverIO.Element,
  elementType: string
): Promise<WebdriverIO.Element> {
  let selector: any = element.selector;
  // Get a collection of matching elements
  let found: boolean = true;
  let newSelector: string = "";
  let newElement: any = element;
  // let elements: WebdriverIO.Element[];
  let elements: any;
  let normalizedElementType: string = "";
  let elementName: string = "";

  try {
    elements = await $$(selector);
    if (elements.length === 0) {
      // Extract the element type if not provided
      if (elementType === "") {
        let index: number = selector.indexOf("[");
        normalizedElementType = selector.substring(0, index);
      } else {
        normalizedElementType = normalizeElementType(elementType);
      }

      switch (normalizedElementType) {
        case "//a":
          elementName = selector.match(/=".*"/)[0].slice(2, -1);
          newSelector = `//button[contains(@type,"${elementName}")]`;
          break;

        case "//button":
          elementName = selector.match(/=".*"/)[0].slice(2, -1);
          newSelector = `//a[contains(text(),"${elementName}")]`;
          found = await isElementVisible(await $(newSelector));
          break;

        case "//input":
          elementName = selector.match(/=".*"/)[0].slice(2, -1);
          newSelector = `//input[contains(@id,"${elementName}")]`;
          found = await isElementVisible(await $(newSelector));
          if (!found) {
            newSelector = `//input[contains(@name,"${elementName}")]`;
            await isElementVisible(await $(newSelector));
          }
          break;

        case "//select":
          elementName = selector.match(/=".*"/)[0].slice(2, -1);
          // Find a div with the text above a combobox
          newSelector = `//div[contains(text(),'${elementName}')]//following::input`;
          found = await isElementVisible(await $(newSelector));
          break;

        case "//*":
          elementName = selector.match(/=".*"/)[0].slice(2, -1);
          newSelector = `//*[contains(@id,'${elementName}')]`;
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
          `  WARNING: Replaced ${selector}\n                    with ${newSelector}`
        );
      }
    }
  } catch (error) {
    found = false;
  }

  if (!found) {
    await log(`  ERROR: Unable to find Selector '${selector}' class switched as selector '${newSelector}'`);
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
  let elementSelector: any;
  let visible: boolean = true;
  try {
    elementSelector = await element.selector;
    try {
      await browser.execute(
        `arguments[0].style.border = '5px solid ${color}';`,
        element
      );
      visible = await isElementVisible(element);
    } catch (error: any) {
      // Handle stale element
      const newElement = await browser.$(elementSelector);
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
  let isInViewport = await element.isDisplayedInViewport();
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

  let messageString: string = message;

  try {
    if (typeof message === "string" || typeof message === "number") {
      if (message) {

        if (messageString.toString().includes(`[object Promise]`)) {
          messageString = (`--->  WARN: ${message} \n      Promise object detected. async function call missing await keyword.`);
          console.trace();
        }

        if (messageString.includes("WARN: ")) {
          messageString = ANSI_WARNING + messageString + ANSI_RESET

        } else if (messageString.includes("FAIL: ") || messageString.includes("ERROR: ") || messageString.includes("Promise")) {
          messageString = ANSI_FAIL + messageString + ANSI_RESET

        } else if (messageString.includes("PASS: ")) {
          // PASS
          messageString = ANSI_PASS + message + ANSI_RESET
        } else {
          messageString = ANSI_TEXT + message + ANSI_RESET
        }


        //Send colored content to Debug console

        //Highlight CSS and XPath selectors in Purple case-insensitive to 'Selector' and 'selector'
        messageString = messageString.replace(/Selector '(.*?)'/ig, `Selector '${ANSI_LOCATOR}$1${ANSI_RESET}'`);

        // Highlight accent marks strings in White
        messageString = messageString.replace(/`([^`]+)`/g, `${ANSI_STRING}$1${ANSI_RESET}`);

        console.log(`--->   ${messageString}`);
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
      log(`WARNING: Unable to normalize element type ${elementType}`);
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
let waitforTimeout = browser.options.waitforTimeout;

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

export async function setValueAdv(
  inputField: WebdriverIO.Element,
  text: string
) {
  let success: boolean = false;

  inputField = await getValidElement(inputField, "field");

  const SELECTOR = await inputField.selector;

  let newValue: string = replaceTags(text);
  let scrubbedValue: string = newValue
  let fieldName: string = await getFieldName(inputField)

  //Mask Passwords in output
  if (fieldName.includes("ssword")) {
    scrubbedValue = maskValue(scrubbedValue)
  }

  await log(`Entering \`${scrubbedValue}\` into selector '${SELECTOR}'`);

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
      await log(`  WARN: setValueAdvIfExists - Skipped entering \`${scrubbedValue}\` in selector '${SELECTOR}' without failing the test`);
      ASB.set(IF_EXISTS, false)
      return true;

    } else {

      await log(
        `  ERROR: ${SELECTOR} was not populated with \`${scrubbedValue}\`.\n       ${error.message}`
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
  await element.scrollIntoView({ block: "center", inline: "center" });
}

export async function sleep(ms: number) {
  await log(`Waiting ${ms} ms...`);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Wrapper of selectByVisibleText
export async function select(
  listElement: WebdriverIO.Element,
  item: string
): Promise<boolean> {
  //@ts-ignore
  return await listElement.selectByVisibleText(item);
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
          await log(`ERROR: Spinner did not close after ${timeout} seconds`);
          break;
        }
      }
    } catch (error) {
      // Spinner no longer exists
    }
    await log(
      `  Spinner Elapsed time: ${Math.floor(performance.now() - startTime)} ms`
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
  listElement: WebdriverIO.Element,
  item: string
): Promise<boolean> {
  let success: boolean = false;
  let itemValue: String = "No Item selected"
  let listItems: WebdriverIO.Element[]
  let listItem: WebdriverIO.Element
  let textContent: string = " "
  // Empty item list - do nothing
  if (item.length === 0) {
    await log(`  ERROR: ${listElement} had no list item passed.\n`)
    return true;
  }

  //Get a valid list element
  listElement = await getValidElement(listElement, "list");

  // Get the name of the element
  // let listname = await getListName(listElement);

  // Comboboxes look like input fields
  let isCombobox = listElement.selector.toString().includes("//input")

  if (isCombobox) {
    //@ts-ignore
    await listElement.doubleClick() //Selects all the text in the combobox

    // Allow user to pass a number like 3 for March
    if (typeof (item) === 'number') {

      // Try number select
      const index: number = item;
      try {
        await (await $(`//span[normalize-space()='${item}']`)).click();
        itemValue = await listElement.getText();
        // Report actual item selected
        global.log(`  Item selected: "${itemValue}"`)
        success = true;
      } catch (error: any) {

        if (ASB.get(IF_EXISTS) === true) {
          await log(`  WARN: SelectAdvIfExists - Skipped selecting \`${item}\` in combobox selector '${ASB.get("elementSelector")}' without failing the test`);
          ASB.set(IF_EXISTS, false)
          return true;
        }

        await log(`  ERROR: ${listElement} could not select "${item}" was not selected\n
        ${error.message}`);
      }
    } else {
      // Clear the field.
      await listElement.click() // Select All Clear Mac and Windows
      await browser.keys(['Home']);
      await browser.keys(['Shift', 'End']);
      await browser.keys(['Delete']);
      await browser.keys(`${item}`)
      // await browser.pause(3000); // Demo

      // Find the item in the list
      try {
        //listItem = await browser.$(`//li/*[contains(text(),'${item}')])`)
        listItems = await browser.$$(`//li/*`)

        for (const listItem of listItems) {
          if ((await listItem.getText()).includes(item)) // Found the element
            break;
        }
        await clickAdv(listItem)
      } catch (error) {
        // no such item
        if (ASB.get(IF_EXISTS) === true) {
          await log(`  WARN: SelectAdvIfExists - Skipped selecting \`${item}\` in selector '${ASB.get("elementSelector")}' without failing the test`);
          ASB.set(IF_EXISTS, false)
          return true;
        }

        listItems = await browser.$$(`//li/*`)
        for (const listItem of listItems) {
          textContent += await listItem.getText() + " | "; // Get the text content of the element
        }
        await log(`  ERROR: "${item}" was not found in combobox: \n ${textContent}`)
      }

      // Click the item
      await (await $(`//span[normalize-space()='${item}']`)).click();
    }

  } else {

    try {
      // Get the list of options in the select element
      const optionsList: string = await getListValues(listElement);
      console.log(optionsList); // This will print the list of options text in the select element

      if (typeof (item) === 'number') {
        const index: number = item;
        await (await listElement).selectByIndex(index);
      } else {
        await (await listElement).selectByVisibleText(item)
      }
      global.log(`  Item selected: "${item}"`)
      success = true;
    } catch (error: any) {
      if (ASB.get(IF_EXISTS) === true) {
        await log(`  WARN: SelectAdvIfExists - Skipped selecting item number ${item} in selector '${ASB.get("elementSelector")}' without failing the test`);
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
export async function expectAdv(actual: any, assertionType: any, expected: any) {
  const softAssert = expect;

  const getAssertionType = {
    equals: () => (softAssert(actual).toEqual(expected)),
    contains: () => (softAssert(actual).toContain(expected)),
    exists: () => (softAssert(actual).toBeExisting()),
    isEnabled: () => (softAssert(actual).toBeEnabled()),
    isDisabled: () => (softAssert(actual).toBeDisabled()),
    doesNotExist: () => (softAssert(actual).not.toBeExisting()),
    doesNotContain: () => (softAssert(actual).not.toContain(expected)),
    toHaveTextContaining: () => (softAssert(actual).toHaveTextContaining(expected)),

    default: () => (console.info('Invalid assertion type: ', assertionType)),
  };
  (getAssertionType[assertionType] || getAssertionType['default'])();

  if (!getAssertionType[assertionType]) {
    console.info('assertion type failure : =======>>>>>>>>>>> ', assertionType)
    allureReporter.addAttachment('Assertion Failure: ', `Invalid Assertion Type = ${assertionType}`, 'text/plain');
    allureReporter.addAttachment('Assertion Error: ', console.error, 'text/plain');
    global.log(`FAIL: Invalid Assertion Type = ${assertionType}`);

  } else {
    allureReporter.addAttachment('Assertion Passes: ', `Valid Assertion Type = ${assertionType}`, 'text/plain');
    console.info('assertion type passed : =======>>>>>>>>>>> ', assertionType)
  }

  allureReporter.endStep();
}
// For the full list of options please got to
// https://github.com/webdriverio/expect-webdriverio/blob/main/docs/API.md
