namespace PROJECT {
    export class BTTask_AttackTarget extends PROJECT.BTNode {
        private tree: PROJECT.BehaviorTree;
        private targetKey: string;
        private target: BABYLON.TransformNode;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BTTask_AttackTarget") {
            super(transform, scene, properties, alias);
            
            if (properties.tree) this.tree = properties.tree;
            if (properties.targetKey) this.targetKey = properties.targetKey;
        }

        protected execute(): PROJECT.NodeResult {
            if (!this.tree || this.tree.blackboardData == null || !this.tree.blackboardData.getBlackboardData(this.targetKey, this.target))
                return PROJECT.NodeResult.Failure;

            const behaviorInterface = this.tree.getBehaviorTreeInterface();
            if (behaviorInterface == null)
                return PROJECT.NodeResult.Failure;

            behaviorInterface.attackTarget(this.target);
            return PROJECT.NodeResult.Success;
        }
    }
}
