/**
 * BTTask_Log - Behavior tree task for logging messages
 */
namespace PROJECT {
    export class BTTask_Log extends PROJECT.BTNode {
        private message: string = "";
        
        constructor(message: string) {
            super(null);
            this.message = message;
        }
        
        protected execute(): PROJECT.NodeResult {
            console.log(this.message);
            return PROJECT.NodeResult.Success;
        }
    }
}
