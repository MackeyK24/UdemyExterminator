/**
 * Blackboard - Data storage class for behavior trees
 */
namespace PROJECT {
    export interface BlackboardResult {
        success: boolean;
        value: any;
    }
    
    export class Blackboard {
        private blackboardData: Map<string, any> = new Map<string, any>();
        private onBlackboardValueChangeCallbacks: Array<(key: string, val: any) => void> = [];
        
        constructor() {
        }
        
        public setOrAddData(key: string, val: any): void {
            this.blackboardData.set(key, val);
            this.notifyValueChange(key, val);
        }
        
        public getBlackboardData(key: string): BlackboardResult {
            if (this.blackboardData.has(key)) {
                return {
                    success: true,
                    value: this.blackboardData.get(key)
                };
            }
            
            return {
                success: false,
                value: null
            };
        }
        
        public removeBlackboardData(key: string): void {
            this.blackboardData.delete(key);
            this.notifyValueChange(key, null);
        }
        
        public hasKey(key: string): boolean {
            return this.blackboardData.has(key);
        }
        
        public registerOnBlackboardValueChange(callback: (key: string, val: any) => void): void {
            this.onBlackboardValueChangeCallbacks.push(callback);
        }
        
        public unregisterOnBlackboardValueChange(callback: (key: string, val: any) => void): void {
            const index = this.onBlackboardValueChangeCallbacks.indexOf(callback);
            if (index !== -1) {
                this.onBlackboardValueChangeCallbacks.splice(index, 1);
            }
        }
        
        private notifyValueChange(key: string, val: any): void {
            for (const callback of this.onBlackboardValueChangeCallbacks) {
                callback(key, val);
            }
        }
    }
}
