/**
 * BTTask_MoveToLoc - Behavior tree task for moving an agent to a location
 */
namespace PROJECT {
    export class BTTask_MoveToLoc extends PROJECT.BTNode {
        private agent: TOOLKIT.NavigationAgent = null;
        private locKey: string = "";
        private loc: BABYLON.Vector3 = null;
        private acceptableDistance: number = 1.0;
        private tree: PROJECT.BehaviorTree = null;
        
        constructor(tree: PROJECT.BehaviorTree, locKey: string, acceptableDistance: number = 1.0) {
            super(tree);
            this.tree = tree;
            this.locKey = locKey;
            this.acceptableDistance = acceptableDistance;
        }
        
        protected execute(): PROJECT.NodeResult {
            const blackboard = this.tree.blackboard;
            if (!blackboard || !blackboard.getBlackboardData(this.locKey, this.loc)) {
                return PROJECT.NodeResult.Failure;
            }
            
            this.agent = this.tree.transform.getComponent("TOOLKIT.NavigationAgent") as TOOLKIT.NavigationAgent;
            if (!this.agent) {
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
            if (!this.loc) {
                this.agent.isStopped = true;
                return PROJECT.NodeResult.Failure;
            }
            
            this.agent.setDestination(this.loc);
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
            if (this.agent) {
                this.agent.isStopped = true;
            }
        }
    }
}
