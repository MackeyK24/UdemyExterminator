namespace PROJECT {
    export class BTTask_Spawn extends PROJECT.BTNode {
        private spawnComponent: PROJECT.SpawnComponent;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BTTask_Spawn") {
            super(transform, scene, properties, alias);
        }
        
        public initialize(tree: PROJECT.BehaviorTree): void {
            this.spawnComponent = TOOLKIT.SceneManager.FindScriptComponent(tree.transform, "PROJECT.SpawnComponent") as PROJECT.SpawnComponent;
        }
        
        protected override execute(): PROJECT.NodeResult {
            if (this.spawnComponent == null || !this.spawnComponent.startSpawn()) {
                return PROJECT.NodeResult.Failure;
            }
            
            return PROJECT.NodeResult.Success;
        }
    }
}
