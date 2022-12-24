/**
 * Console.log wrapper 
 *    - Does not print if string is empty / null
 *    - Prints trace if not passed string or number
 * @param message 
 */
import { Optional } from 'utility-types';

import * as fs from 'fs';
import * as path from 'path';


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
          console.error(`Error reading directory: ${error}`);
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

export async function pageSync(ms: Optional<number> = 25, waitOnSamePage: Optional<boolean> = false): Promise<boolean>
{
  let result = false;
  let skipToEnd = false;
  let thisUrl = await browser.getUrl();

  if (waitOnSamePage === false)
  {
    if (thisUrl === ASB.get('LAST_URL'))
    {
      //skip rest of function  
      result = true;
      skipToEnd = true
    }
  }

  if (skipToEnd === false)
  {
    ASB.set('LAST_URL', thisUrl)
  }

  return result;

}

export default function doNothing(): void
{
  //Do nothing
}