namespace PROJECT {
    export class BTTask_RotateTowardsTarget extends PROJECT.BTNode {
        private tree: PROJECT.BehaviorTree;
        private targetKey: string;
        private acceptableDegrees: number;
        private target: BABYLON.TransformNode;
        private behaviorTreeInterface: PROJECT.IBehaviorTreeInterface;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BTTask_RotateTowardsTarget") {
            super(transform, scene, properties, alias);
        }
        
        public initialize(tree: PROJECT.BehaviorTree, targetKey: string, acceptableDegrees: number = 10.0): void {
            this.tree = tree;
            this.targetKey = targetKey;
            this.acceptableDegrees = acceptableDegrees;
            
            this.behaviorTreeInterface = tree.getBehaviorTreeInterface();
        }
        
        protected override execute(): PROJECT.NodeResult {
            if (this.tree == null || this.tree.blackboard == null)
                return PROJECT.NodeResult.Failure;
            
            if (this.behaviorTreeInterface == null)
                return PROJECT.NodeResult.Failure;
            
            const result = this.tree.blackboard.getBlackboardData<BABYLON.TransformNode>(this.targetKey);
            if (!result.success)
                return PROJECT.NodeResult.Failure;
                
            this.target = result.value;
            
            if (this.isInAcceptableDegrees())
                return PROJECT.NodeResult.Success;
            
            this.tree.blackboard.onBlackboardValueChange.push(this.blackboardValueChanged.bind(this));
            
            return PROJECT.NodeResult.Inprogress;
        }
        
        private blackboardValueChanged(key: string, val: any): void {
            if (key == this.targetKey) {
                this.target = val as BABYLON.TransformNode;
            }
        }
        
        protected override update(): PROJECT.NodeResult {
            if (this.target == null)
                return PROJECT.NodeResult.Failure;
                
            if (this.isInAcceptableDegrees())
                return PROJECT.NodeResult.Success;
            
            this.behaviorTreeInterface.rotateTowards(this.target);
            return PROJECT.NodeResult.Inprogress;
        }
        
        private isInAcceptableDegrees(): boolean {
            if (this.target == null) return false;
            
            const targetPosition = this.target.position;
            const treePosition = this.tree.transform.position;
            
            const targetDir = targetPosition.subtract(treePosition).normalize();
            const dir = this.tree.transform.forward;
            
            const dotProduct = BABYLON.Vector3.Dot(targetDir, dir);
            const degrees = Math.acos(dotProduct) * (180 / Math.PI);
            
            return degrees <= this.acceptableDegrees;
        }
        
        protected override end(): void {
            if (this.tree && this.tree.blackboard) {
                const index = this.tree.blackboard.onBlackboardValueChange.indexOf(this.blackboardValueChanged.bind(this));
                if (index !== -1) {
                    this.tree.blackboard.onBlackboardValueChange.splice(index, 1);
                }
            }
            
            super.end();
        }
    }
}
