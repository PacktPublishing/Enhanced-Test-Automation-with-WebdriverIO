
function switchboardFactory(): { get: (k: string) => any; set: (k: string, v: any) => void; } {
    const switchboard = new Map;
    switchboard.set("alreadyFailed", false);
    
    return {
        get(k: string) {
            return switchboard.get(k);
        },
        set(k: string, v: any) {
            switchboard.set(k, v);
        }
    }
}
  


export const ASB: { get: (k: string) => any; set: (k: string, v: any) => void; } = switchboardFactory();