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
  if (typeof message === "string" || typeof message === "number") {
    if (message) {
      console.log(`---> ${message}`);
    }
  } else {
    console.log(`--->   helpers.console() received: ${message}`);
    console.trace();
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
  ms: number = 125,
  waitOnSamePage: boolean = false
): Promise<boolean> {
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
      await delay(ms);

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
      log(`  WARN: pageSync() completed in ${duration/1000} sec  (${duration} ms) `);
    } else {
      log(`  pageSync() completed in ${duration} ms`); // Optional debug messaging
    }
  }

  return result;
}

async function delay(ms: number) {
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

export default function doNothing(): void {
  //Do nothing
}

export async function clickAdv(
  element: ChainablePromiseElement<WebdriverIO.Element>
) {
  let success: boolean = false;
  const SELECTOR = await element.selector;

  log(`Clicking ${SELECTOR}`);

  try {
    await element.waitForDisplayed();
    await element.scrollIntoView({ block: 'center', inline: 'center' });
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
