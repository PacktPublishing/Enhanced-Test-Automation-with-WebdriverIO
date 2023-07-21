import * as fs from "fs";
import * as path from "path";
import { ASB } from "./globalObjects";
import allureReporter from "@wdio/allure-reporter";

export async function clickAdv(element: WebdriverIO.Element) {
  let success: boolean = false;

  element = await getValidElement(element, "button");
  const SELECTOR = await element.selector;
  await log(`Clicking ${SELECTOR}`);

  try {
    //await element.waitForDisplayed();

    if (!(await isElementInViewport(element))) {
      await scrollIntoView(element);
      await waitForElementToStopMoving(element, 1000);
    }
    await highlightOn(element);
    //@ts-ignore
    await element.click({ block: "center" });
    await pageSync();
    success = true;
  } catch (error: any) {
    await log(`  ERROR: ${SELECTOR} was not clicked.\n       ${error.message}`);
    expect(`to be clickable`).toEqual(SELECTOR);
    // Throw the error to stop the test
    //@ts-ignore
    await element.click({ block: "center" });
  }

  return success;
}

// async function findElement(selector: string): Promise<WebdriverIO.Element> {
//   try {
//     return await browser.$(selector);
//   } catch (error: any) {
//     if (error.message.includes("stale")) {
//       // element is stale, so we need to recreate it
//       return await browser.$(selector);
//     } else {
//       throw error;
//     }
//   }
// }

export async function getValidElement(
  element: WebdriverIO.Element,
  elementType: string
): Promise<WebdriverIO.Element> {
  let selector: any = await element.selector;
  // Get a collection of matching elements
  let found: boolean = true;
  let newSelector: string = "";
  let newElement: any = element;
  let elements: WebdriverIO.Element[];
  let elementText: string = "";

  try {
    elements = await $$(selector);

    if (elements.length === 0) {
      // Extract the element type if not provided
      if (elementType === "") {
        let index: number = selector.indexOf("[");
        elementType = selector.substring(0, index);
      } else {
        elementText = normalizeElementType(elementType);
      }

      switch (elementType) {
        case "//a":
          elementText = selector.match(/=".*"/)[0].slice(2, -1);
          newSelector = `//button[contains(@type,'${elementText}')]`;

          break;

        case "//button":
          elementText = selector.match(/=".*"/)[0].slice(2, -1);
          newSelector = `//a[contains(text(),'${elementText}'])`;
          found = await isElementVisible(await $(newSelector));
          break;

        case "//input":
          elementText = selector.match(/=".*"/)[0].slice(2, -1);

          newSelector = `//input[contains(@id,'${elementText}'])`;
          found = await isElementVisible(await $(newSelector));

          if (!found) {
            newSelector = `//input[contains(@name,'${elementText}'])`;
            await isElementVisible(await $(newSelector));
          }
          break;

        case "//*":
          elementText = selector.match(/=".*"/)[0].slice(2, -1);
          newSelector = `//*[contains(@id,'${elementText}'])`;
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
    await log(`  ERROR: Unable to find ${selector}`);
  }

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
export function getToday(offset: number = 0, format: string = "MM-dd-yyyy") {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + offset);
  return currentDate.toLocaleDateString(undefined, {
    year: format.includes("yyyy") ? "numeric" : undefined,
    month: format.includes("MM")
      ? "2-digit"
      : format.includes("M")
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
      //log (`  highlightOn ${elementSelector} refresh success`)
    }
  } catch (error) {
    // Element no longer exists
    visible = false;
  }
  return visible;
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
  export async function log(message: any): Promise<void> {
    try {
      if (typeof message === "string" || typeof message === "number") {
        if (message) {
          console.log(`---> ${message}`);
          if (message.toString().includes(`[object Promise]`)) {
            console.log(`    Possiblly missing await statement`);
            console.trace();
          }
        }
      }
    } catch (error: any) {
      console.log(`--->   helpers.console(): ${error.message}`);
    }
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
    // const waitforTimeout = browser.options.waitforTimeout;
    let visibleSpans: string = 'div:not([style*="visibility: hidden"])';
    let elements: ElementArrayType = await $$(visibleSpans);

    let exit: boolean = false;
    let count: number = elements.length;
    let lastCount: number = 0;
    let retries: number = 3;
    let retry: number = retries;
    let timeout: number = 20; // 5 second timeout
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
          `  WARN: pageSync() completed in ${
              duration / 1000
          } sec  (${duration} ms) `
      );
    } else {
      //log(`  pageSync() completed in ${duration} ms`); // Optional debug messaging
    }
  }

  return result;
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

//Resolves stale element
// async function refreshElement(
//   element: WebdriverIO.Element
// ): Promise<WebdriverIO.Element> {
//   return await browser.$(element.selector);
// }

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

      //case tagLower.includes("<otherTag"):
      // Tage replacemente code here
      // break;

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



export async function sleep(ms: number) {
  await log(`Waiting ${ms} ms...`);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function selectAdv(
  list: WebdriverIO.Element,
  text: string
) {
  let listItem: WebdriverIO.Element
  let success: boolean = false;

  list = await getValidElement(list, "list");

  const SELECTOR = await list.selector;

  let newValue: string = replaceTags(text);

  await log(`Selecting '${newValue}' in ${SELECTOR}`);
}


export async function setValueAdv(
  inputField: WebdriverIO.Element,
  text: string
) {
  let success: boolean = false;

  inputField = await getValidElement(inputField, "field");

  const SELECTOR = await inputField.selector;

  let newValue: string = replaceTags(text);

  await log(`Entering '${newValue}' into ${SELECTOR}`);

  try {
    //await element.waitForDisplayed();

    if (!(await isElementInViewport(inputField))) {
      await scrollIntoView(inputField);
      await waitForElementToStopMoving(inputField, 3000);
    }

    await highlightOn(inputField);

    //Check if text was entered
    // Clear input field
    await inputField.click();

    // Do we need to clear the field?
    if (await inputField.getValue()) await inputField.setValue(newValue);

    // Send text to input field
    for (const letter of text) {
      await inputField.addValue(letter);
    }

    success = true;
  } catch (error: any) {
    await log(
        `  ERROR: ${SELECTOR} was not populated with ${text}.\n       ${error.message}`
    );
    expect(`to be editable`).toEqual(SELECTOR);
    // Throw the error to stop the test
    await inputField.setValue(text);
  }

  return success;
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

// export async function isExists(element: WebdriverIO.Element) {
//   try {
//     return await element.isExisting();
//   } catch (error) {
//     return false;
//   }
// }

export async function scrollIntoView(element: WebdriverIO.Element) {
  await element.scrollIntoView({block: "center", inline: "center"});
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

// export async function getElementType(element: WebdriverIO.Element) {
//   // get from existing element
//   let tagName = await element.getTagName();
//
//   if (tagName === null) {
//     // get from non existing element instead of null
//     let selector = element.selector.toString()
//     let startIndex = selector.indexOf('\\') + 1;
//     let endIndex = selector.indexOf('[');
//     tagName = selector.substring(startIndex, endIndex);
//   }
//   return tagName;
// }


/**
 * This is the function for doign asserts and passing the results to the allure report
 * @param actual
 * @param assertionType
 * @param expected
 */
export async function expectAdv(actual:any, assertionType:any, expected:any) {
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

  if (!getAssertionType[assertionType]){
    console.info('assertion type failure : =======>>>>>>>>>>> ', assertionType)
    allureReporter.addAttachment('Assertion Failure: ', `Invalid Assertion Type = ${assertionType}`, 'text/plain');
    allureReporter.addAttachment('Assertion Error: ', console.error, 'text/plain');
  } else {
    allureReporter.addAttachment('Assertion Passes: ', `Valid Assertion Type = ${assertionType}`, 'text/plain');
    console.info('assertion type passed : =======>>>>>>>>>>> ', assertionType)
  }

  allureReporter.endStep();
}

// https://github.com/webdriverio/expect-webdriverio/blob/main/docs/API.md