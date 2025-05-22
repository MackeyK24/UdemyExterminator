namespace PROJECT {
    export class BTTaskGroup_AttackTarget extends PROJECT.BTTask_Group {
        private moveAcceptableDistance: number;
        private rotationAcceptableRaidus: number;
        private attackCooldownDuration: number;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BTTaskGroup_AttackTarget") {
            super(transform, scene, properties, alias);
        }
        
        public initialize(tree: PROJECT.BehaviorTree, moveAcceptableDistance: number = 2.0, rotationAcceptableRaidus: number = 10.0, attackCooldownDuration: number = 0): void {
            super.initialize(tree);
            this.moveAcceptableDistance = moveAcceptableDistance;
            this.rotationAcceptableRaidus = rotationAcceptableRaidus;
            this.attackCooldownDuration = attackCooldownDuration;
        }
        
        protected override constructTree(root: { node: PROJECT.BTNode }): void {
            const attackTargetSeq = new PROJECT.Sequencer(this.transform, this.scene);
            const moveToTarget = new PROJECT.BTTask_MoveToTarget(this.transform, this.scene);
            moveToTarget.initialize(this.tree, "Target", this.moveAcceptableDistance);
            
            const rotateTowardsTarget = new PROJECT.BTTask_RotateTowardsTarget(this.transform, this.scene);
            rotateTowardsTarget.initialize(this.tree, "Target", this.rotationAcceptableRaidus);
            
            const attackTarget = new PROJECT.BTTask_AttackTarget(this.transform, this.scene);
            attackTarget.initialize(this.tree, "Target");
            
            const attackCooldownDecorator = new PROJECT.CooldownDecorator(this.transform, this.scene);
            attackCooldownDecorator.initialize(this.tree, attackTarget, this.attackCooldownDuration);
            
            attackTargetSeq.addChild(moveToTarget);
            attackTargetSeq.addChild(rotateTowardsTarget);
            attackTargetSeq.addChild(attackCooldownDecorator);
            
            const attackTargetDecorator = new PROJECT.BlackboardDecorator(this.transform, this.scene);
            attackTargetDecorator.initialize(
                this.tree,
                attackTargetSeq,
                "Target",
                PROJECT.ERunCondition.KeyExists,
                PROJECT.ENotifyRule.RunConditionChange,
                PROJECT.ENotifyAbort.Both
            );
            
            root.node = attackTargetDecorator;
        }
    }
}
