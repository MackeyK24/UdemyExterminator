/**
 * BTTask_RemoveBlackboardData - Behavior tree task for removing data from a blackboard
 */
namespace PROJECT {
    export class BTTask_RemoveBlackboardData extends PROJECT.BTNode {
        private tree: PROJECT.BehaviorTree = null;
        private keyToRemove: string = "";
        
        constructor(tree: PROJECT.BehaviorTree, keyToRemove: string) {
            super(tree);
            this.tree = tree;
            this.keyToRemove = keyToRemove;
        }
        
        protected execute(): PROJECT.NodeResult {
            if (this.tree && this.tree.blackboard) {
                this.tree.blackboard.removeBlackboardData(this.keyToRemove);
                return PROJECT.NodeResult.Success;
            }
            return PROJECT.NodeResult.Failure;
        }
    }
}
