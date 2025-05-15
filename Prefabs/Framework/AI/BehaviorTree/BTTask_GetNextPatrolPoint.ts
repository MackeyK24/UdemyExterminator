/**
 * BTTask_GetNextPatrolPoint - Behavior tree task for retrieving the next patrol point
 */
namespace PROJECT {
    export class BTTask_GetNextPatrolPoint extends PROJECT.BTNode {
        private patrollingComp: PROJECT.PatrollingComponent = null;
        private tree: PROJECT.BehaviorTree = null;
        private patrolPointKey: string = "";
        
        constructor(tree: PROJECT.BehaviorTree, patrolPointKey: string) {
            super(tree);
            this.patrollingComp = tree.getComponent("PROJECT.PatrollingComponent") as PROJECT.PatrollingComponent;
            this.tree = tree;
            this.patrolPointKey = patrolPointKey;
        }
        
        protected execute(): PROJECT.NodeResult {
            if (this.patrollingComp) {
                const result = this.patrollingComp.getNextPatrolPoint();
                
                if (result.success) {
                    this.tree.blackboard.setOrAddData(this.patrolPointKey, result.point);
                    return PROJECT.NodeResult.Success;
                }
            }
            
            return PROJECT.NodeResult.Failure;
        }
    }
}
