/**
 * BTTaskGroup_MoveToLastSeenLoc - Behavior tree task group for moving to the last seen location
 */
namespace PROJECT {
    export class BTTaskGroup_MoveToLastSeenLoc extends PROJECT.BTTask_Group {
        private acceptableDistance: number = 3.0;
        
        constructor(tree: PROJECT.BehaviorTree, acceptableDistance: number = 3.0) {
            super(tree);
            this.acceptableDistance = acceptableDistance;
        }
        
        protected constructTree(rootNode: { value: PROJECT.BTNode }): void {
            const checkLastSeenLocSeq = new PROJECT.Sequencer(this.tree);
            
            const moveToLastSeenLoc = new PROJECT.BTTask_MoveToLoc(this.tree, "LastSeenLoc", this.acceptableDistance);
            const waitAtLastSeenLoc = new PROJECT.BTTask_Wait(2.0);
            const removeLastSeenLoc = new PROJECT.BTTask_RemoveBlackboardData(this.tree, "LastSeenLoc");
            
            checkLastSeenLocSeq.addChild(moveToLastSeenLoc);
            checkLastSeenLocSeq.addChild(waitAtLastSeenLoc);
            checkLastSeenLocSeq.addChild(removeLastSeenLoc);
            
            const checkLastSeenLocDecorator = new PROJECT.BlackboardDecorator(
                this.tree,
                checkLastSeenLocSeq,
                "LastSeenLoc",
                PROJECT.BlackboardDecorator.RunCondition.KeyExists,
                PROJECT.BlackboardDecorator.NotifyRule.RunConditionChange,
                PROJECT.BlackboardDecorator.NotifyAbort.None
            );
            
            rootNode.value = checkLastSeenLocDecorator;
        }
    }
}
