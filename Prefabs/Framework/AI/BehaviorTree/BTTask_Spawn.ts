namespace PROJECT {
    export class BTTask_Spawn extends PROJECT.BTNode {
        private spawnComponent: PROJECT.SpawnComponent;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BTTask_Spawn") {
            super(transform, scene, properties, alias);
            
            if (properties.tree) {
                this.spawnComponent = properties.tree.getComponent("PROJECT.SpawnComponent") as PROJECT.SpawnComponent;
            }
        }

        protected execute(): PROJECT.NodeResult {
            if (this.spawnComponent == null || !this.spawnComponent.startSpawn()) {
                return PROJECT.NodeResult.Failure;
            }

            return PROJECT.NodeResult.Success;
        }
    }
}
