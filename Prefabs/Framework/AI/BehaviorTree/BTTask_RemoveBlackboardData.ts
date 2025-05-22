namespace PROJECT {
    export class BTTask_RemoveBlackboardData extends PROJECT.BTNode {
        private tree: PROJECT.BehaviorTree;
        private keyToRemove: string;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BTTask_RemoveBlackboardData") {
            super(transform, scene, properties, alias);
        }
        
        public initialize(tree: PROJECT.BehaviorTree, keyToRemove: string): void {
            this.tree = tree;
            this.keyToRemove = keyToRemove;
        }
        
        protected override execute(): PROJECT.NodeResult {
            if (this.tree != null && this.tree.blackboard != null) {
                this.tree.blackboard.removeBlackboardData(this.keyToRemove);
                return PROJECT.NodeResult.Success;
            }
            return PROJECT.NodeResult.Failure;
        }
    }
}
