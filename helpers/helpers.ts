/**
 * Console.log wrapper 
 *    - Does not print if string is empty / null
 *    - Prints trace if not passed string or number
 * @param message 
 */
export function log(message: any) {
    if (typeof message === 'string' || typeof message === 'number') {
      if (message) {
        console.log(`---> ${message}`);
      }
    } else {
      console.log (`--->   helpers.console() received: ${message}`)
      console.trace();
    }
  }
