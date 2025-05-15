/**
 * BTTaskGroup_Patrolling - Behavior tree task group for patrolling behavior
 */
namespace PROJECT {
    export class BTTaskGroup_Patrolling extends PROJECT.BTTask_Group {
        private acceptableDistance: number = 3.0;
        
        constructor(tree: PROJECT.BehaviorTree, acceptableDistance: number = 3.0) {
            super(tree);
            this.acceptableDistance = acceptableDistance;
        }
        
        protected constructTree(rootNode: { value: PROJECT.BTNode }): void {
            const patrollingSeq = new PROJECT.Sequencer(this.tree);
            
            const getNextPatrolPoint = new PROJECT.BTTask_GetNextPatrolPoint(this.tree, "PatrolPoint");
            const moveToPatrolPoint = new PROJECT.BTTask_MoveToLoc(this.tree, "PatrolPoint", this.acceptableDistance);
            const waitAtPatrolPoint = new PROJECT.BTTask_Wait(2.0);
            
            patrollingSeq.addChild(getNextPatrolPoint);
            patrollingSeq.addChild(moveToPatrolPoint);
            patrollingSeq.addChild(waitAtPatrolPoint);
            
            rootNode.value = patrollingSeq;
        }
    }
}
