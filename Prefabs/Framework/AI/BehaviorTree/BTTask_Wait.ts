/**
 * BTTask_Wait - Behavior tree task for implementing wait/delay functionality
 */
namespace PROJECT {
    export class BTTask_Wait extends PROJECT.BTNode {
        private waitTime: number = 2.0;
        private timeElapsed: number = 0.0;
        
        constructor(waitTime: number) {
            super(null); // Note: C# version doesn't pass tree to base constructor
            this.waitTime = waitTime;
        }
        
        protected execute(): PROJECT.NodeResult {
            if (this.waitTime <= 0) {
                return PROJECT.NodeResult.Success;
            }
            
            console.log(`wait started with duration: ${this.waitTime}`);
            this.timeElapsed = 0.0;
            return PROJECT.NodeResult.Inprogress;
        }
        
        protected update(): PROJECT.NodeResult {
            this.timeElapsed += this.getDeltaTime();
            
            if (this.timeElapsed >= this.waitTime) {
                console.log("Wait finished");
                return PROJECT.NodeResult.Success;
            }
            
            return PROJECT.NodeResult.Inprogress;
        }
    }
}
