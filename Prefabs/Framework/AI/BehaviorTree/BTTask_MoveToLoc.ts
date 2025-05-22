namespace PROJECT {
    export class BTTask_MoveToLoc extends PROJECT.BTNode {
        private agent: TOOLKIT.NavigationAgent;
        private locKey: string;
        private loc: BABYLON.Vector3;
        private acceptableDistance: number = 1.0;
        private tree: PROJECT.BehaviorTree;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BTTask_MoveToLoc") {
            super(transform, scene, properties, alias);
        }
        
        public initialize(tree: PROJECT.BehaviorTree, locKey: string, acceptableDistance: number = 1.0): void {
            this.tree = tree;
            this.locKey = locKey;
            this.acceptableDistance = acceptableDistance;
        }
        
        protected override execute(): PROJECT.NodeResult {
            const blackboard = this.tree.blackboard;
            if (!blackboard || !blackboard.getBlackboardData(this.locKey, (value: any) => { this.loc = value; })) {
                return PROJECT.NodeResult.Failure;
            }
            
            this.agent = TOOLKIT.SceneManager.FindScriptComponent(this.tree.transform, "TOOLKIT.NavigationAgent") as TOOLKIT.NavigationAgent;
            if (!this.agent) {
                return PROJECT.NodeResult.Failure;
            }
            
            if (this.isLocInAcceptableDistance()) {
                return PROJECT.NodeResult.Success;
            }
            
            this.agent.setDestination(this.loc);
            return PROJECT.NodeResult.Inprogress;
        }
        
        protected override update(): PROJECT.NodeResult {
            if (this.isLocInAcceptableDistance()) {
                return PROJECT.NodeResult.Success;
            }
            return PROJECT.NodeResult.Inprogress;
        }
        
        private isLocInAcceptableDistance(): boolean {
            const distance = BABYLON.Vector3.Distance(
                this.loc,
                this.tree.transform.position
            );
            
            return distance <= this.acceptableDistance;
        }
        
        protected override end(): void {
            super.end();
        }
    }
}
