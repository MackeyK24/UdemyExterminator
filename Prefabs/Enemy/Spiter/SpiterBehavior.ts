/**
 * SpiterBehavior - Behavior tree implementation for Spiter enemy
 */
namespace PROJECT {
    export class SpiterBehavior extends PROJECT.BehaviorTree {
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.SpiterBehavior");
        }
        
        protected constructTree(rootNode: { value: PROJECT.BTNode }): void {
            const rootSelector = new PROJECT.Selector(this);
            
            rootSelector.addChild(new PROJECT.BTTaskGroup_AttackTarget(this, 5, 10.0, 4.0));
            
            rootSelector.addChild(new PROJECT.BTTaskGroup_MoveToLastSeenLoc(this, 3));
            
            rootSelector.addChild(new PROJECT.BTTaskGroup_Patrolling(this, 3));
            
            rootNode.value = rootSelector;
        }
    }
}
