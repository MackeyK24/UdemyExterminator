/**
 * BTTask_MoveToTarget - Behavior tree task for moving an agent to a target
 */
namespace PROJECT {
    export class BTTask_MoveToTarget extends PROJECT.BTNode {
        private agent: TOOLKIT.NavigationAgent = null;
        private targetKey: string = "";
        private target: BABYLON.TransformNode = null;
        private acceptableDistance: number = 1.0;
        private tree: PROJECT.BehaviorTree = null;
        
        constructor(tree: PROJECT.BehaviorTree, targetKey: string, acceptableDistance: number = 1.0) {
            super(tree);
            this.targetKey = targetKey;
            this.acceptableDistance = acceptableDistance;
            this.tree = tree;
        }
        
        protected execute(): PROJECT.NodeResult {
            const blackboard = this.tree.blackboard;
            if (!blackboard || !blackboard.getBlackboardData(this.targetKey, this.target)) {
                return PROJECT.NodeResult.Failure;
            }
            
            this.agent = this.tree.transform.getComponent("TOOLKIT.NavigationAgent") as TOOLKIT.NavigationAgent;
            if (!this.agent) {
                return PROJECT.NodeResult.Failure;
            }
            
            if (this.isTargetInAcceptableDistance()) {
                return PROJECT.NodeResult.Success;
            }
            
            blackboard.onBlackboardValueChangeCallbacks.push(this.blackboardValueChanged.bind(this));
            
            this.agent.setDestination(this.target.position);
            this.agent.isStopped = false;
            return PROJECT.NodeResult.Inprogress;
        }
        
        private blackboardValueChanged(key: string, val: any): void {
            if (key === this.targetKey) {
                this.target = val as BABYLON.TransformNode;
            }
        }
        
        protected update(): PROJECT.NodeResult {
            if (!this.target) {
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
            if (this.agent) {
                this.agent.isStopped = true;
            }
            
            if (this.tree && this.tree.blackboard) {
                const index = this.tree.blackboard.onBlackboardValueChangeCallbacks.indexOf(this.blackboardValueChanged.bind(this));
                if (index !== -1) {
                    this.tree.blackboard.onBlackboardValueChangeCallbacks.splice(index, 1);
                }
            }
        }
    }
}
