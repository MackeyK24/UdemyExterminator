namespace PROJECT {
    export class Blackboard {
        private blackboardData: { [key: string]: any } = {};
        
        public onBlackboardValueChange: ((key: string, val: any) => void)[] = [];
        
        public setOrAddData(key: string, val: any): void {
            if (this.blackboardData.hasOwnProperty(key)) {
                this.blackboardData[key] = val;
            } else {
                this.blackboardData[key] = val;
            }
            
            if (this.onBlackboardValueChange.length > 0) {
                for (let i = 0; i < this.onBlackboardValueChange.length; i++) {
                    this.onBlackboardValueChange[i](key, val);
                }
            }
        }
        
        public getBlackboardData<T>(key: string, val: T): boolean {
            if (this.blackboardData.hasOwnProperty(key)) {
                val = this.blackboardData[key] as T;
                return true;
            }
            return false;
        }
        
        public removeBlackboardData(key: string): void {
            delete this.blackboardData[key];
            
            if (this.onBlackboardValueChange.length > 0) {
                for (let i = 0; i < this.onBlackboardValueChange.length; i++) {
                    this.onBlackboardValueChange[i](key, null);
                }
            }
        }
        
        public hasKey(key: string): boolean {
            return this.blackboardData.hasOwnProperty(key);
        }
    }
}
