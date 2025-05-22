namespace PROJECT {
    export class ChomperBehavior extends PROJECT.BehaviorTree {
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.ChomperBehavior") {
            super(transform, scene, properties, alias);
        }
        
        protected override constructTree(rootNode: PROJECT.BTNode): void {
            const rootSelector = new PROJECT.Selector();
            
            rootSelector.addChild(new PROJECT.BTTaskGroup_AttackTarget(this.transform, this.scene, { target: 2, range: 10.0 }));
            
            rootSelector.addChild(new PROJECT.BTTaskGroup_MoveToLastSeenLoc(this.transform, this.scene, { priority: 3 }));
            
            rootSelector.addChild(new PROJECT.BTTaskGroup_Patrolling(this.transform, this.scene, { priority: 3 }));
            
            rootNode = rootSelector;
        }
    }
}
