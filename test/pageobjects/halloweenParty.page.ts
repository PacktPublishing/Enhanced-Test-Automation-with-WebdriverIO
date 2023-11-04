import Page from './page.js'; 
import * as helpers from "../../helpers/helpers.js"; 

/** 
 * sub page with selectors for a specific page 
 */ 
class HalloweenPartyPage extends Page { 
    /** 
     * define selectors using getter methods 
     */ 
    public get hostParty () { 
        return $(`//a[contains(normalize-space(),'ost')]`); 
    } 

    public get attendParty () { 
        return $(`//a[contains(normalize-space(),'ttend')]`); 
    } 
    
    public async build (testdata) { 

        let success:boolean = true; 
      
       
         // Is this the page to process?   	 
      
         if (await ASB.get("page") === "attend-a-party") { 
      
           if (testdata.HostOrAttend.toLowerCase() === `host`){ 
      
              success = await  
                 helpers.clickAdv(await this.hostParty); 
      
           }else{ 
      
              success = await  
                 helpers.clickAdv(await this.attendParty); 
      
              } 
      
            } 
          } 
      
         return success; 
      
      } 
      
       
      
      export default new HalloweenPartyPage(); 