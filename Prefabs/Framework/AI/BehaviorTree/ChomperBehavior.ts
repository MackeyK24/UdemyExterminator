/**
 * ChomperBehavior - Behavior tree implementation for Chomper enemy
 */
namespace PROJECT {
    export class ChomperBehavior extends PROJECT.BehaviorTree {
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.ChomperBehavior");
        }
        
        protected constructTree(rootNode: { value: PROJECT.BTNode }): void {
            const rootSelector = new PROJECT.Selector(this);
            
            rootSelector.addChild(new PROJECT.BTTaskGroup_AttackTarget(this, 2, 10.0));
            
            rootSelector.addChild(new PROJECT.BTTaskGroup_MoveToLastSeenLoc(this, 3));
            
            rootSelector.addChild(new PROJECT.BTTaskGroup_Patrolling(this, 3));
            
            rootNode.value = rootSelector;
        }
    }
}
