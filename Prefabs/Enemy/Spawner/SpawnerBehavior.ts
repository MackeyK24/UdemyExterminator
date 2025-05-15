/**
 * SpawnerBehavior - Behavior tree for spawner entities
 */
namespace PROJECT {
    export class SpawnerBehavior extends PROJECT.BehaviorTree {
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.SpawnerBehavior");
        }
        
        protected override constructTree(rootNode: { node: PROJECT.BTNode }): void {
            const spawnTask = new PROJECT.BTTask_Spawn(this);
            const spawnCooldownDeco = new PROJECT.CooldownDecorator(this, spawnTask, 2.0);
            const spawnBBDecorator = new PROJECT.BlackboardDecorator(
                this, 
                spawnCooldownDeco, 
                "Target", 
                PROJECT.BlackboardDecorator.RunCondition.KeyExists, 
                PROJECT.BlackboardDecorator.NotifyRule.RunConditionChange, 
                PROJECT.BlackboardDecorator.NotifyAbort.Both
            );
            
            rootNode.node = spawnBBDecorator;
        }
    }
}
