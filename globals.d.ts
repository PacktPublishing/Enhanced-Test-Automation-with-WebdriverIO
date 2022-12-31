declare var Map: { new (): Map<any, any> };
declare type GlobalThis = { [key: string]: any };
declare function log(message: string): void {
    console.log(message.toUpperCase());
}

declare global {
    var globalString: string
    
    interface GlobalInterface {
      value: unknown
    }
  
    interface Helpers {
      log: (message: string) => void;
    }

    type GlobalType = {
      value: unknown
    }
  }

//   declare function log(message: any): void {
//     console.log(message.toUpperCase());
//     if (message) { //truthy value check
//         if (message===Promise){
//             console.log(`--->     WARN: Log was passed a Promise oject`)
//             console.trace()
//         }else{
//             console.log(`---> ${message}`)
//         }
//     }
// }

  export {}