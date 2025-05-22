namespace PROJECT {
    export class Blackboard extends TOOLKIT.ScriptComponent {
        private blackboardData: { [key: string]: any } = {};
        
        public onBlackboardValueChange: ((key: string, val: any) => void)[] = [];
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.Blackboard") {
            super(transform, scene, properties, alias);
        }
        
        public setOrAddData(key: string, val: any): void {
            if (key in this.blackboardData) {
                this.blackboardData[key] = val;
            } else {
                this.blackboardData[key] = val;
            }
            
            for (const callback of this.onBlackboardValueChange) {
                callback(key, val);
            }
        }
        
        public getBlackboardData<T>(key: string): { success: boolean, value: T } {
            const result = { success: false, value: null as T };
            
            if (key in this.blackboardData) {
                result.value = this.blackboardData[key] as T;
                result.success = true;
            }
            
            return result;
        }
        
        public removeBlackboardData(key: string): void {
            delete this.blackboardData[key];
            
            for (const callback of this.onBlackboardValueChange) {
                callback(key, null);
            }
        }
        
        public hasKey(key: string): boolean {
            return key in this.blackboardData;
        }
    }
}
