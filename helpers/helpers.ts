import * as fs from 'fs';
import * as path from 'path';

/**
 * Console.log wrapper 
 *    - Does not print if string is empty / null
 *    - Prints trace if not passed string or number
 * @param message 
 */
export function log(message: any): void
{
  if (typeof message === 'string' || typeof message === 'number')
  {
    if (message)
    {
      console.log(`---> ${message}`);
    }
  } else
  {
    console.log(`--->   helpers.console() received: ${message}`)
    console.trace();
  }
}

/**
 * Output the files or an error of a relative path
 * listFiles('./path/to/directory');
 * @param relativePath 
 */
function listFiles(relativePath: string): void
{
  // Resolve the relative path to an absolute path
  const absolutePath = path.resolve(relativePath);

  // Check if the path is valid
  fs.exists(absolutePath, (exists: boolean) =>
  {
    if (exists)
    {
      // If the path is valid, read the directory and output the list of files
      fs.readdir(absolutePath, (error: Error | null, files: string[]) =>
      {
        if (error)
        {
          console.error(`Error reading directory: ${error}`);
          return;
        }
        console.log(`Files in directory ${relativePath}:`);
        files.forEach((file: string) => console.log(file));
      });
    } else
    {
      // If the path is not valid, output an error message
      console.error(`The path ${relativePath} is not valid`);
    }
  });
}


/**
 * Wait for 
 */
let LAST_URL: String = ""
export async function pageSync(ms: number = 25, waitOnSamePage: boolean = false): Promise<boolean>
{
  // Pessimistic result
  let result = false;
  let skipToEnd = false;

  let thisUrl = await browser.getUrl();

  if (waitOnSamePage === false)
  {
    if (thisUrl === LAST_URL)
    {
      //skip rest of function 
      result = true;
      skipToEnd = true
    }
  }

  if (skipToEnd === false)
  {
    LAST_URL = thisUrl
    let visibleSpans: String = `div:not([style*="visibility: hidden"])`
    let elements: any = await $$(visibleSpans)
    let exit: boolean = false
    let count: number = elements.length
    let lastCount: number = 0
    let retries: number = 3
    let retry: number = retries
    let timeout: number = 20 // 5 second timeout
    let start: number = Date.now();
    //let loopStart:number = start;
    let end: number = 0
  
    while (retry > 0)
    {

      if (lastCount != count)
      {
        retry = retries // Reset the count of attempts 
      }

      // Exit after 3 stable element counts
      if (retry == 0)
      {
        break;
      }

      if (timeout-- === 0)
      {
        log("Page never settled")
        exit = true
        break;
      }

      lastCount = count

      // wait 1/4 sec before next count check
      delay(ms)

      try {
        elements = await $$(visibleSpans);
      } catch (error: any) {
        exit = true
        switch (error.name) {
          case "TimeoutError":
            log(`ERROR: Timed out while trying to find visible spans.`);
            break;
          case "NoSuchElementError":
            log(`ERROR: Could not find any visible spans.`);
            break;
          default:
            if (error.message === `Couldn't find page handle`){
              log(`WARN: Browser closed. (Possibly missing await)`);
            } else {
              log(`ERROR: ${error.name}: ${error}`);
            }
        }
        // Error thrown: Exit loop
        break;
      }
   
      count = await elements.length
      retry--;
    }
  
    end = (Date.now() - start) / 1000

    // Metric: Report if the page took more than 3 seconds to build
    if (ms > 3000)
    {
      log(`  WARN: pageSync() completed in ${end} sec  (${ms} ms) `)
    }else{
      log(`  pageSync() completed in ${ms} ms`) // Optional debug messaging
    }

  }

  return result;

}


function delay(ms: number)
{
  const start = Date.now();
  let now = start;
  while (now - start < ms)
  {
    now = Date.now();
  }
}

async function sleep(ms: number)
{
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function doNothing(): void
{
  //Do nothing
}