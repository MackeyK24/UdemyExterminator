namespace PROJECT {
    export class BTTask_Wait extends PROJECT.BTNode {
        private waitTime: number = 2.0;
        private timeElapsed: number = 0.0;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BTTask_Wait") {
            super(transform, scene, properties, alias);
        }
        
        public initialize(waitTime: number): void {
            this.waitTime = waitTime;
        }
        
        protected override execute(): PROJECT.NodeResult {
            if (this.waitTime <= 0) {
                return PROJECT.NodeResult.Success;
            }
            
            console.log(`wait started with duration: ${this.waitTime}`);
            this.timeElapsed = 0.0;
            return PROJECT.NodeResult.Inprogress;
        }
        
        protected override update(): PROJECT.NodeResult {
            this.timeElapsed += this.getDeltaTime();
            
            if (this.timeElapsed >= this.waitTime) {
                console.log("Wait finished");
                return PROJECT.NodeResult.Success;
            }
            
            return PROJECT.NodeResult.Inprogress;
        }
    }
}
