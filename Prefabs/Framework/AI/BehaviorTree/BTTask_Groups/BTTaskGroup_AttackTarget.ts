namespace PROJECT {
    export class BTTaskGroup_AttackTarget extends PROJECT.BTTask_Group {
        private moveAcceptableDistance: number;
        private rotationAcceptableRaidus: number;
        private attackCooldownDuration: number;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BTTaskGroup_AttackTarget") {
            super(transform, scene, properties, alias);
            
            if (properties.tree) this.tree = properties.tree;
            if (properties.moveAcceptableDistance) this.moveAcceptableDistance = properties.moveAcceptableDistance;
            else this.moveAcceptableDistance = 2.0;
            
            if (properties.rotationAcceptableRaidus) this.rotationAcceptableRaidus = properties.rotationAcceptableRaidus;
            else this.rotationAcceptableRaidus = 10.0;
            
            if (properties.attackCooldownDuration) this.attackCooldownDuration = properties.attackCooldownDuration;
            else this.attackCooldownDuration = 0;
        }
        
        protected constructTree(root: PROJECT.BTNode): void {
            const attackTargetSeq = new PROJECT.Sequencer(this.transform, this.scene);
            
            const moveToTarget = new PROJECT.BTTask_MoveToTarget(this.transform, this.scene, {
                tree: this.tree,
                targetKey: "Target",
                acceptableDistance: this.moveAcceptableDistance
            });
            
            const rotateTowardsTarget = new PROJECT.BTTask_RotateTowardsTarget(this.transform, this.scene, {
                tree: this.tree,
                targetKey: "Target",
                acceptableRadius: this.rotationAcceptableRaidus
            });
            
            const attackTarget = new PROJECT.BTTask_AttackTarget(this.transform, this.scene, {
                tree: this.tree,
                targetKey: "Target"
            });
            
            const attackCooldownDecorator = new PROJECT.CooldownDecorator(this.transform, this.scene, {
                tree: this.tree,
                child: attackTarget,
                cooldownDuration: this.attackCooldownDuration
            });
            
            attackTargetSeq.addChild(moveToTarget);
            attackTargetSeq.addChild(rotateTowardsTarget);
            attackTargetSeq.addChild(attackCooldownDecorator);
            
            const attackTargetDecorator = new PROJECT.BlackboardDecorator(this.transform, this.scene, {
                tree: this.tree,
                child: attackTargetSeq,
                key: "Target",
                runCondition: PROJECT.BlackboardDecorator.RunCondition.KeyExists,
                notifyRule: PROJECT.BlackboardDecorator.NotifyRule.RunConditionChange,
                notifyAbort: PROJECT.BlackboardDecorator.NotifyAbort.both
            });
            
            root = attackTargetDecorator;
        }
    }
}
