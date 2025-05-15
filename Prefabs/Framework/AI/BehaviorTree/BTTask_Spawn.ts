/**
 * BTTask_Spawn - Behavior tree task for spawning entities
 */
namespace PROJECT {
    export class BTTask_Spawn extends PROJECT.BTNode {
        private spawnComponent: PROJECT.SpawnComponent = null;
        
        constructor(tree: PROJECT.BehaviorTree) {
            super(tree);
            this.spawnComponent = tree.getComponent("PROJECT.SpawnComponent") as PROJECT.SpawnComponent;
        }
        
        protected execute(): PROJECT.NodeResult {
            if (!this.spawnComponent || !this.spawnComponent.startSpawn()) {
                return PROJECT.NodeResult.Failure;
            }
            
            return PROJECT.NodeResult.Success;
        }
    }
}
