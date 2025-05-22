namespace PROJECT {
    export class BTTask_MoveToTarget extends PROJECT.BTNode {
        private agent: TOOLKIT.NavigationAgent;
        private targetKey: string;
        private target: BABYLON.TransformNode;
        private acceptableDistance: number = 1.0;
        private tree: PROJECT.BehaviorTree;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BTTask_MoveToTarget") {
            super(transform, scene, properties, alias);
        }
        
        public initialize(tree: PROJECT.BehaviorTree, targetKey: string, acceptableDistance: number = 1.0): void {
            this.targetKey = targetKey;
            this.acceptableDistance = acceptableDistance;
            this.tree = tree;
        }
        
        protected override execute(): PROJECT.NodeResult {
            const blackboard = this.tree.blackboard;
            if (!blackboard || !blackboard.getBlackboardData(this.targetKey, (value: any) => { this.target = value; })) {
                return PROJECT.NodeResult.Failure;
            }
            
            this.agent = TOOLKIT.SceneManager.FindScriptComponent(this.tree.transform, "TOOLKIT.NavigationAgent") as TOOLKIT.NavigationAgent;
            if (!this.agent) {
                return PROJECT.NodeResult.Failure;
            }
            
            if (this.isTargetInAcceptableDistance()) {
                return PROJECT.NodeResult.Success;
            }
            
            blackboard.onBlackboardValueChange.push(this.blackboardValueChanged.bind(this));
            
            this.agent.setDestination(this.target.position);
            return PROJECT.NodeResult.Inprogress;
        }
        
        private blackboardValueChanged(key: string, val: any): void {
            if (key === this.targetKey) {
                this.target = val;
            }
        }
        
        protected override update(): PROJECT.NodeResult {
            if (!this.target) {
                return PROJECT.NodeResult.Failure;
            }
            
            this.agent.setDestination(this.target.position);
            
            if (this.isTargetInAcceptableDistance()) {
                return PROJECT.NodeResult.Success;
            }
            
            return PROJECT.NodeResult.Inprogress;
        }
        
        private isTargetInAcceptableDistance(): boolean {
            const distance = BABYLON.Vector3.Distance(
                this.target.position,
                this.tree.transform.position
            );
            
            return distance <= this.acceptableDistance;
        }
        
        protected override end(): void {
            const blackboardIndex = this.tree.blackboard.onBlackboardValueChange.indexOf(this.blackboardValueChanged.bind(this));
            if (blackboardIndex !== -1) {
                this.tree.blackboard.onBlackboardValueChange.splice(blackboardIndex, 1);
            }
            
            super.end();
        }
    }
}
