namespace PROJECT {
    export class BTTask_RemoveBlackboardData extends PROJECT.BTNode {
        private tree: PROJECT.BehaviorTree;
        private keyToRemove: string;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BTTask_RemoveBlackboardData") {
            super(transform, scene, properties, alias);
            
            if (properties.tree) this.tree = properties.tree;
            if (properties.keyToRemove) this.keyToRemove = properties.keyToRemove;
        }
        
        protected execute(): PROJECT.NodeResult {
            if (this.tree != null && this.tree.blackboardData != null) {
                this.tree.blackboardData.removeBlackboardData(this.keyToRemove);
                return PROJECT.NodeResult.Success;
            }
            return PROJECT.NodeResult.Failure;
        }
    }
}
