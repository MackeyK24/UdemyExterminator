/**
 * BTTask_RotateTowardsTarget - Behavior tree task for rotating towards a target
 */
namespace PROJECT {
    export class BTTask_RotateTowardsTarget extends PROJECT.BTNode {
        private tree: PROJECT.BehaviorTree = null;
        private targetKey: string = "";
        private acceptableDegrees: number = 10;
        private target: BABYLON.TransformNode = null;
        private behaviorTreeInterface: PROJECT.IBehaviorTreeInterface = null;
        
        constructor(tree: PROJECT.BehaviorTree, targetKey: string, acceptableDegrees: number = 10) {
            super(tree);
            this.tree = tree;
            this.targetKey = targetKey;
            this.acceptableDegrees = acceptableDegrees;
            
            this.behaviorTreeInterface = tree.getBehaviorTreeInterface();
        }
        
        protected execute(): PROJECT.NodeResult {
            if (!this.tree || !this.tree.blackboard) {
                return PROJECT.NodeResult.Failure;
            }
            
            if (!this.behaviorTreeInterface) {
                return PROJECT.NodeResult.Failure;
            }
            
            const result = this.tree.blackboard.getBlackboardData(this.targetKey);
            if (!result.success) {
                return PROJECT.NodeResult.Failure;
            }
            
            this.target = result.value as BABYLON.TransformNode;
            
            if (this.isInAcceptableDegrees()) {
                return PROJECT.NodeResult.Success;
            }
            
            this.tree.blackboard.registerOnBlackboardValueChange(this.blackboardValueChanged.bind(this));
            
            return PROJECT.NodeResult.Inprogress;
        }
        
        private blackboardValueChanged(key: string, val: any): void {
            if (key === this.targetKey) {
                this.target = val as BABYLON.TransformNode;
            }
        }
        
        protected update(): PROJECT.NodeResult {
            if (!this.target) {
                return PROJECT.NodeResult.Failure;
            }
            
            if (this.isInAcceptableDegrees()) {
                return PROJECT.NodeResult.Success;
            }
            
            this.behaviorTreeInterface.rotateTowards(this.target);
            return PROJECT.NodeResult.Inprogress;
        }
        
        private isInAcceptableDegrees(): boolean {
            if (!this.target) return false;
            
            const targetPosition = this.target.position;
            const treePosition = this.tree.transform.position;
            
            const targetDir = BABYLON.Vector3.Normalize(targetPosition.subtract(treePosition));
            const dir = new BABYLON.Vector3(0, 0, 1).applyRotationQuaternion(this.tree.transform.rotationQuaternion);
            
            const degrees = BABYLON.Vector3.GetAngleBetweenVectors(targetDir, dir, BABYLON.Vector3.Up()) * (180 / Math.PI);
            return degrees <= this.acceptableDegrees;
        }
        
        protected end(): void {
            this.tree.blackboard.unregisterOnBlackboardValueChange(this.blackboardValueChanged.bind(this));
            super.end();
        }
    }
}
