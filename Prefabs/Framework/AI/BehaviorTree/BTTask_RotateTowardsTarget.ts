namespace PROJECT {
    export class BTTask_RotateTowardsTarget extends PROJECT.BTNode {
        private tree: PROJECT.BehaviorTree;
        private targetKey: string;
        private acceptableDegrees: number;
        private target: BABYLON.TransformNode;
        private behaviorTreeInterface: PROJECT.IBehaviorTreeInterface;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BTTask_RotateTowardsTarget") {
            super(transform, scene, properties, alias);
            
            if (properties.tree) this.tree = properties.tree;
            if (properties.targetKey) this.targetKey = properties.targetKey;
            if (properties.acceptableDegrees) this.acceptableDegrees = properties.acceptableDegrees;
            else this.acceptableDegrees = 10;
            
            if (this.tree) {
                this.behaviorTreeInterface = this.tree.getBehaviorTreeInterface();
            }
        }

        protected execute(): PROJECT.NodeResult {
            if (this.tree == null || this.tree.blackboardData == null)
                return PROJECT.NodeResult.Failure;

            if (this.behaviorTreeInterface == null)
                return PROJECT.NodeResult.Failure;

            if (!this.tree.blackboardData.getBlackboardData(this.targetKey, this.target))
                return PROJECT.NodeResult.Failure;

            if (this.isInAcceptableDegrees())
                return PROJECT.NodeResult.Success;

            this.tree.blackboardData.onBlackboardValueChange.push(this.blackboardValueChanged.bind(this));

            return PROJECT.NodeResult.Inprogress;
        }

        private blackboardValueChanged(key: string, val: any): void {
            if (key == this.targetKey) {
                this.target = val;
            }
        }

        protected update(): PROJECT.NodeResult {
            if (this.target == null) 
                return PROJECT.NodeResult.Failure;
                
            if (this.isInAcceptableDegrees())
                return PROJECT.NodeResult.Success;

            this.behaviorTreeInterface.rotateTowards(this.target);
            return PROJECT.NodeResult.Inprogress;
        }

        private isInAcceptableDegrees(): boolean {
            if (this.target == null) return false;
            
            const targetDir = BABYLON.Vector3.Normalize(
                this.target.position.subtract(this.tree.transform.position)
            );
            const dir = this.tree.transform.forward;

            const degrees = BABYLON.Vector3.GetAngleBetweenVectors(targetDir, dir, BABYLON.Vector3.Up());
            return degrees <= this.acceptableDegrees;
        }

        protected end(): void {
            const index = this.tree.blackboardData.onBlackboardValueChange.indexOf(this.blackboardValueChanged.bind(this));
            if (index !== -1) {
                this.tree.blackboardData.onBlackboardValueChange.splice(index, 1);
            }
            super.end();
        }
    }
}
