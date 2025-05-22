namespace PROJECT {
    export class BTTask_MoveToTarget extends PROJECT.BTNode {
        private agent: TOOLKIT.NavigationAgent;
        private targetKey: string;
        private target: BABYLON.TransformNode;
        private acceptableDistance: number = 1.0;
        private tree: PROJECT.BehaviorTree;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BTTask_MoveToTarget") {
            super(transform, scene, properties, alias);
            
            if (properties.targetKey) this.targetKey = properties.targetKey;
            if (properties.acceptableDistance) this.acceptableDistance = properties.acceptableDistance;
            if (properties.tree) this.tree = properties.tree;
        }
        
        protected execute(): PROJECT.NodeResult {
            const blackboard = this.tree.blackboard;
            if (blackboard == null || !blackboard.getBlackboardData(this.targetKey, this.target)) {
                return PROJECT.NodeResult.Failure;
            }
            
            this.agent = this.tree.getComponent("TOOLKIT.NavigationAgent") as TOOLKIT.NavigationAgent;
            if (this.agent == null) {
                return PROJECT.NodeResult.Failure;
            }
            
            if (this.isTargetInAcceptableDistance()) {
                return PROJECT.NodeResult.Success;
            }
            
            blackboard.onBlackboardValueChange.push(this.blackboardValueChanged.bind(this));
            
            this.agent.setDestination(this.target.position);
            this.agent.isStopped = false;
            return PROJECT.NodeResult.Inprogress;
        }
        
        private blackboardValueChanged(key: string, val: any): void {
            if (key == this.targetKey) {
                this.target = val;
            }
        }
        
        protected update(): PROJECT.NodeResult {
            if (this.target == null) {
                this.agent.isStopped = true;
                return PROJECT.NodeResult.Failure;
            }
            
            this.agent.setDestination(this.target.position);
            if (this.isTargetInAcceptableDistance()) {
                this.agent.isStopped = true;
                return PROJECT.NodeResult.Success;
            }
            return PROJECT.NodeResult.Inprogress;
        }
        
        private isTargetInAcceptableDistance(): boolean {
            return BABYLON.Vector3.Distance(this.target.position, this.tree.transform.position) <= this.acceptableDistance;
        }
        
        protected end(): void {
            this.agent.isStopped = true;
            const index = this.tree.blackboard.onBlackboardValueChange.indexOf(this.blackboardValueChanged.bind(this));
            if (index !== -1) {
                this.tree.blackboard.onBlackboardValueChange.splice(index, 1);
            }
            super.end();
        }
    }
}
