namespace PROJECT {
    export class SpiterBehavior extends PROJECT.BehaviorTree {
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.SpiterBehavior") {
            super(transform, scene, properties, alias);
        }
        
        protected override constructTree(rootNode: { node: PROJECT.BTNode }): void {
            const rootSelector = new PROJECT.Selector(this.transform, this.scene);
            
            const attackTarget = new PROJECT.BTTaskGroup_AttackTarget(this.transform, this.scene);
            attackTarget.initialize(this, 5, 10.0, 4.0);
            
            const moveToLastSeenLoc = new PROJECT.BTTaskGroup_MoveToLastSeenLoc(this.transform, this.scene);
            moveToLastSeenLoc.initialize(this, 3);
            
            const patrolling = new PROJECT.BTTaskGroup_Patrolling(this.transform, this.scene);
            patrolling.initialize(this, 3);
            
            rootSelector.addChild(attackTarget);
            rootSelector.addChild(moveToLastSeenLoc);
            rootSelector.addChild(patrolling);
            
            rootNode.node = rootSelector;
        }
    }
}
