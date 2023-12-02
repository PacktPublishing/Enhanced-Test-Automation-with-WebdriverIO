function switchboardFactory(): { get: (k: string) => any; set: (k: string, v: any) => void; print: () => void; } {
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
            for (const [key, value] of switchboard.entries()) {
                console.log(`Key: ${key}, Value: ${value}`);
            }
        }
    }
}
export const ASB: { get: (k: string) => any; set: (k: string, v: any) => void; print: () => void; } = switchboardFactory();