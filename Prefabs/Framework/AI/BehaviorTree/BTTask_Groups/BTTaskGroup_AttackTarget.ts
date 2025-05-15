/**
 * BTTaskGroup_AttackTarget - Behavior tree task group for attacking targets
 */
namespace PROJECT {
    export class BTTaskGroup_AttackTarget extends PROJECT.BTTask_Group {
        private moveAcceptableDistance: number = 2.0;
        private rotationAcceptableRadius: number = 10.0;
        private attackCooldownDuration: number = 0.0;
        
        constructor(tree: PROJECT.BehaviorTree, moveAcceptableDistance: number = 2.0, 
                   rotationAcceptableRadius: number = 10.0, attackCooldownDuration: number = 0.0) {
            super(tree);
            this.moveAcceptableDistance = moveAcceptableDistance;
            this.rotationAcceptableRadius = rotationAcceptableRadius;
            this.attackCooldownDuration = attackCooldownDuration;
        }
        
        protected constructTree(rootNode: { value: PROJECT.BTNode }): void {
            const attackTargetSeq = new PROJECT.Sequencer(this.tree);
            
            const moveToTarget = new PROJECT.BTTask_MoveToTarget(this.tree, "Target", this.moveAcceptableDistance);
            const rotateTowardsTarget = new PROJECT.BTTask_RotateTowardsTarget(this.tree, "Target", this.rotationAcceptableRadius);
            const attackTarget = new PROJECT.BTTask_AttackTarget(this.tree, "Target");
            
            const attackCooldownDecorator = new PROJECT.CooldownDecorator(
                this.tree, 
                attackTarget, 
                this.attackCooldownDuration
            );
            
            attackTargetSeq.addChild(moveToTarget);
            attackTargetSeq.addChild(rotateTowardsTarget);
            attackTargetSeq.addChild(attackCooldownDecorator);
            
            const attackTargetDecorator = new PROJECT.BlackboardDecorator(
                this.tree,
                attackTargetSeq,
                "Target",
                PROJECT.BlackboardDecorator.RunCondition.KeyExists,
                PROJECT.BlackboardDecorator.NotifyRule.RunConditionChange,
                PROJECT.BlackboardDecorator.NotifyAbort.Both
            );
            
            rootNode.value = attackTargetDecorator;
        }
    }
}
