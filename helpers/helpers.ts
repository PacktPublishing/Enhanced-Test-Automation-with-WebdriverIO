import * as fs from "fs";
import * as path from "path";
import { ASB } from "./globalObjects.js";
import { expect as expectChai } from "chai";
import { assert as assertChai } from "chai";
import allure from "@wdio/allure-reporter";
/**
 * Console.log wrapper
 *    - Does not print if string is empty / null
 *    - Prints trace if not passed string or number
 * @param message
 */
export function log(message: any): void {
  try {
    if (typeof message === "string" || typeof message === "number") {
      if (message) {
        console.log(`---> ${message}`);
      }
    } else {
      console.log(`--->   helpers.console() received: ${message}`);
      console.trace();
    }
  } catch (error: any) {
    console.log(`--->   helpers.console(): ${error.message}`);
  }
}

/**
 * Output the files or an error of a relative path
 * listFiles('./path/to/directory');
 * @param relativePath
 */
function listFiles(relativePath: string): void {
  // Resolve the relative path to an absolute path
  const absolutePath = path.resolve(relativePath);

  // Check if the path is valid
  fs.exists(absolutePath, (exists: boolean) => {
    if (exists) {
      // If the path is valid, read the directory and output the list of files
      fs.readdir(absolutePath, (error: Error | null, files: string[]) => {
        if (error) {
          console.error(`Error reading directory: ${error.message}`);
          return;
        }
        console.log(`Files in directory ${relativePath}:`);
        files.forEach((file: string) => console.log(file));
      });
    } else {
      // If the path is not valid, output an error message
      console.error(`The path ${relativePath} is not valid`);
    }
  });
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
    const waitforTimeout = browser.options.waitforTimeout;
    let visibleSpans: String = `div:not([style*="visibility: hidden"])`;
    let elements: any = await $$(visibleSpans);
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
        log("Page never settled");
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
            log(`ERROR: Timed out while trying to find visible spans.`);
            break;
          case "NoSuchElementError":
            log(`ERROR: Could not find any visible spans.`);
            break;
          default:
            if (error.message === `Couldn't find page handle`) {
              log(`WARN: Browser closed. (Possibly missing await)`);
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

    if (duration > waitforTimeout) {
      log(
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
  if (ms > 500){
  log(`  Waiting ${ms} ms...`); // Custom log
  }

  const start = Date.now();
  let now = start;
  while (now - start < ms) {
    now = Date.now();
  }
}

export async function sleep(ms: number) {
  log(`Waiting ${ms} ms...`); // Custom log
  return new Promise((resolve) => setTimeout(resolve, ms));
}



export async function clickAdv(
  element: ChainablePromiseElement<WebdriverIO.Element>
) {
  let success: boolean = false;
  const SELECTOR = await element.selector;

  log(`Clicking ${SELECTOR}`);

  try {
    //await element.waitForDisplayed();
    
    if (!await isElementInViewport(element)){
      await element.scrollIntoView({ block: "center", inline: "center" });
      await waitForElementToStopMoving(element)
    }
    await highlightOn(element);
    await element.click({ block: "center" });
    await pageSync();
    success = true;
  } catch (error: any) {
    log(`  ERROR: ${SELECTOR} was not clicked.\n       ${error.message}`);
    expect(`to be clickable`).toEqual(SELECTOR);
    // Good Report / Test fails / Not soft assert
  }

  return success;
}

export async function isElementInViewport(element: WebdriverIO.Element): Promise<boolean> {
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
  let timeout = ASB.get("spinnerTimeoutInSeconds")
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
        if  (Date.now() - start > timeout * 1000) {
          log (`ERROR: Spinner did not close after ${timeout} seconds`)
          break;
        }
      }
    } catch (error) {
      // Spinner no longer exists
    }
    log(`  Spinner Elapsed time: ${Math.floor(performance.now() - startTime)} ms`);
  }
  return spinnerDetected;
}

export async function highlightOn(
  element: WebdriverIO.Element,
  color: string = "green"
): Promise<boolean> {
  let elementSelector:any
  let visible: boolean = true;
  try {
      elementSelector = await element.selector;
      try {
        await browser.execute(`arguments[0].style.border = '5px solid ${color}';`, element);
        visible = await isElementVisible(element) 
      } catch (error: any) {
        // Handle stale element
        const newElement = await browser.$(elementSelector)
        ASB.set("element", newElement)
        ASB.set("staleElement", true)
        await browser.execute(`arguments[0].style.border = '5px solid ${color}';`, newElement);
        //log (`  highlightOn ${elementSelector} refresh success`)
      }
  
  } catch (error) {
    // Element no longer exists
    visible = false
  }
  return visible;
}

export async function highlightOff(element: WebdriverIO.Element): Promise<boolean> {
  let visible: boolean = true;
  try {
      await browser.execute(`arguments[0].style.border = "0px";`, element);
  } catch (error) {
      // Element no longer exists
      visible = false;
  }
  return visible;
}

export async function isElementVisible(element: WebdriverIO.Element): Promise<boolean> {
  try {
    const displayed = await element.isDisplayed();
    return displayed;
  } catch (error) {
    return false;
  }
}

//Resolves stale element
async function refreshElement(element: WebdriverIO.Element): Promise<WebdriverIO.Element> {
  return await browser.$(element.selector) 
}

async function findElement(selector: string): Promise<WebdriverIO.Element> {
  try {
    return await browser.$(selector);
  } catch (error) {
    if (error.message.includes('stale')) {
      // element is stale, so we need to recreate it
      return await browser.$(selector);
    } else {
      throw error;
    }
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

export async function waitForElementToStopMoving(element: WebdriverIO.Element, timeout: number = 1500): Promise<boolean> {
  let rect = await element.getRect();
  pause (100);
  let isMoving = (rect !== await element.getRect())  
  let startTime = Date.now();
  
  // Keep checking the element's position until it stops moving or the timeout is reached
  while (isMoving) {
    // If the element's position hasn't changed, it is not moving
    if (rect === await element.getRect()) {
      log (`  Element is static`)
      isMoving = false;
    }else{
      log (`  Element is moving...`)
      pause (100)
    }
    // If the timeout has been reached, stop the loop
    if (Date.now() - startTime > timeout) {
      break;
    }
    // Wait for a short amount of time before checking the element's position again
    await pause(100);
  }

  return !isMoving;
}