function switchboardFactory(): { get: (k: string) => any; set: (k: string, v: any) => void; print: () => void; reset: () => void; } {
    const switchboard = new Map;
    switchboard.set("alreadyFailed", false);
    
    return {
        get(k: string) {
            return switchboard.get(k);
        },
        set(k: string, v: any) {
            switchboard.set(k, v);
        },
        print() {
            console.log(" --->   Switchboard contents:");
            for (const [key, value] of switchboard.entries()) {
                console.log(`  └──>  "${key}": "${value}"`);
            }
        },
        reset() {
            switchboard.clear();
        }
    }
}

export const ASB: {
    reset(): void; 
    get: (k: string) => any; 
    set: (k: string, v: any) => void; 
    print: () => void; 
} = switchboardFactory();