/**
 * BTTask_AlwaysFail - Behavior tree task that always returns failure
 */
namespace PROJECT {
    export class BTTask_AlwaysFail extends PROJECT.BTNode {
        constructor() {
            super(null);
        }
        
        protected execute(): PROJECT.NodeResult {
            console.log("Failed");
            return PROJECT.NodeResult.Failure;
        }
    }
}
