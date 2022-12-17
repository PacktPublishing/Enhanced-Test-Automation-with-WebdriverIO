declare global {
    var globalString: string
    
    interface GlobalInterface {
      value: unknown
    }
  
    type GlobalType = {
      value: unknown
    }
  }
  
  export {}