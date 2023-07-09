import * as fs from "fs";
import * as path from "path";
import { ASB } from "./globalObjects.js";
//import { expect as expectChai } from "chai";
//import { assert as assertChai } from "chai";
import allure from "@wdio/allure-reporter";
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
    const waitForTimeout = 3000

    if (duration > waitForTimeout) {
      await log(
        `  WARN: pageSync() completed in ${duration / 1000
        } sec  (${duration} ms) `
      );
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

export async function sleep(ms: number) {
  await log(`Waiting ${ms} ms...`);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function clickAdv( element: WebdriverIO.Element) {
  
  // Pessimistic success flag
  let success: boolean = false;

  // Self-healing object code
  element = await getValidElement(element);
  const SELECTOR = await element.selector;
  
  // Log the element detail in the console for debugging
  await log(`Clicking ${SELECTOR}`);

  try {
    // Don't wast time on this if element is off screen
    //await element.waitForDisplayed();

    // Scroll the element into view for screen capture
    if (!(await isElementInViewport(element))) {
      await scrollIntoView(element);
      await waitForElementToStopMoving(element, 3000);
    }

    await highlightOn(element);
    // Center the center of the object
    // @ts-ignore not assignable to parameter clickOptions
    await element.click({ block: "center" });
    await pageSync();
    success = true;

  } catch (error: any) {
    await log(`  ERROR: ${SELECTOR} was not clicked.\n       ${error.message}`);
    expect(`to be clickable`).toEqual(SELECTOR);
    // Throw the error to stop the test
    // @ts-ignore not assignable to parameter clickOptions
    await element.click({ block: "center" });
  }

  return success;
}

export async function isElementInViewport(
  element: WebdriverIO.Element
): Promise<boolean> {
  let isInViewport = await element.isDisplayedInViewport();
  return isInViewport;
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
async function refreshElement(
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

async function isExists(element: WebdriverIO.Element) {
  try {
    return await element.isExisting();
  } catch (error) {
    return false;
  }
}

export async function scrollIntoView(element: WebdriverIO.Element) {
  await element.scrollIntoView({ block: "center", inline: "center" });
}



async function waitForElementToStopMoving(element: WebdriverIO.Element, timeout: number): Promise<void> {

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


export async function getValidElement(
  element: WebdriverIO.Element
): Promise<WebdriverIO.Element> {
  let selector: any = await element.selector;
  // Get a collection of matching elements
  let found: boolean = true;
  let newSelector: string = ""
  let newElement: any = element;
  let elements: WebdriverIO.Element[];
  let elementType: string = ""
  let elementText: string = ""

  try {
    elements = await $$(selector);

    if (elements.length === 0) {

      let index: number = selector.indexOf("[");
      elementType = selector.substring(0, index);

      switch (elementType) {
        case "//a":
          elementText = selector.match(/=".*"/)[0].slice(2, -1);
          newSelector = `//button[contains(@type,'${elementText}')]`

          break;

        case "//button":
          elementText = selector.match(/=".*"/)[0].slice(2, -1);
          newSelector = `//a[contains(text(),'${elementText}'])`

          break;

        default:
          found = false;
          newElement = element;
          break;
      }
      newElement = await $(newSelector);
      found = await isElementVisible(newElement)
    }
  } catch (error) {
    found = false;
  }

  // Successful class switch 
  if (found) {
    await log(
      `  WARNING: Replaced ${selector}\n                    with ${newSelector}`
    );
  } else {
    await log(`  ERROR: Unable to find ${selector}`);
  }

  return newElement;
}

async function getElementType(element: WebdriverIO.Element) {

  // get from existing element
  let tagName = await element.getTagName();

  if (tagName === null) {
    // get from non existing element instead of null
    let selector = element.selector.toString()
    let startIndex = selector.indexOf('\\') + 1;
    let endIndex = selector.indexOf('[');
    tagName = selector.substring(startIndex, endIndex);
  }
  return tagName;
}
