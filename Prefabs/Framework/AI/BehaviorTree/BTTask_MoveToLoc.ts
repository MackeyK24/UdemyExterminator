namespace PROJECT {
    export class BTTask_MoveToLoc extends PROJECT.BTNode {
        private agent: TOOLKIT.NavigationAgent;
        private locKey: string;
        private loc: BABYLON.Vector3;
        private acceptableDistance: number = 1.0;
        private tree: PROJECT.BehaviorTree;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BTTask_MoveToLoc") {
            super(transform, scene, properties, alias);
            
            if (properties.tree) this.tree = properties.tree;
            if (properties.locKey) this.locKey = properties.locKey;
            if (properties.acceptableDistance) this.acceptableDistance = properties.acceptableDistance;
        }
        
        protected execute(): PROJECT.NodeResult {
            const blackboard = this.tree.blackboard;
            if (blackboard == null || !blackboard.getBlackboardData(this.locKey, this.loc)) {
                return PROJECT.NodeResult.Failure;
            }
            
            this.agent = this.tree.getComponent("TOOLKIT.NavigationAgent") as TOOLKIT.NavigationAgent;
            if (this.agent == null) {
                return PROJECT.NodeResult.Failure;
            }
            
            if (this.isLocInAcceptableDistance()) {
                return PROJECT.NodeResult.Success;
            }
            
            this.agent.setDestination(this.loc);
            this.agent.isStopped = false;
            return PROJECT.NodeResult.Inprogress;
        }
        
        protected update(): PROJECT.NodeResult {
            if (this.isLocInAcceptableDistance()) {
                this.agent.isStopped = true;
                return PROJECT.NodeResult.Success;
            }
            return PROJECT.NodeResult.Inprogress;
        }
        
        private isLocInAcceptableDistance(): boolean {
            return BABYLON.Vector3.Distance(this.loc, this.tree.transform.position) <= this.acceptableDistance;
        }
        
        protected end(): void {
            this.agent.isStopped = true;
            super.end();
        }
    }
}
