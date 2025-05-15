/**
 * BTTask_AttackTarget - Behavior tree task for attacking a target
 */
namespace PROJECT {
    export class BTTask_AttackTarget extends PROJECT.BTNode {
        private tree: PROJECT.BehaviorTree = null;
        private targetKey: string = "";
        private target: BABYLON.TransformNode = null;
        
        constructor(tree: PROJECT.BehaviorTree, targetKey: string) {
            super(tree);
            this.tree = tree;
            this.targetKey = targetKey;
        }
        
        protected execute(): PROJECT.NodeResult {
            if (!this.tree || !this.tree.blackboard) {
                return PROJECT.NodeResult.Failure;
            }
            
            const result = this.tree.blackboard.getBlackboardData(this.targetKey);
            if (!result.success) {
                return PROJECT.NodeResult.Failure;
            }
            
            this.target = result.value as BABYLON.TransformNode;
            
            const behaviorInterface = this.tree.getBehaviorTreeInterface();
            if (!behaviorInterface) {
                return PROJECT.NodeResult.Failure;
            }
            
            behaviorInterface.attackTarget(this.target);
            return PROJECT.NodeResult.Success;
        }
    }
}
