namespace PROJECT {
    export class BTTask_AttackTarget extends PROJECT.BTNode {
        private tree: PROJECT.BehaviorTree;
        private targetKey: string;
        private target: BABYLON.TransformNode;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BTTask_AttackTarget") {
            super(transform, scene, properties, alias);
        }
        
        public initialize(tree: PROJECT.BehaviorTree, targetKey: string): void {
            this.tree = tree;
            this.targetKey = targetKey;
        }
        
        protected override execute(): PROJECT.NodeResult {
            if (!this.tree || !this.tree.blackboard || !this.tree.blackboard.getBlackboardData<BABYLON.TransformNode>(this.targetKey).success) {
                this.target = this.tree.blackboard.getBlackboardData<BABYLON.TransformNode>(this.targetKey).value;
                return PROJECT.NodeResult.Failure;
            }
            
            const behaviorInterface = this.tree.getBehaviorTreeInterface();
            if (behaviorInterface == null)
                return PROJECT.NodeResult.Failure;
            
            behaviorInterface.attackTarget(this.target);
            return PROJECT.NodeResult.Success;
        }
    }
}
