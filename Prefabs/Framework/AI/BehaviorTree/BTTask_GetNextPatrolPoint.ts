namespace PROJECT {
    export class BTTask_GetNextPatrolPoint extends PROJECT.BTNode {
        private patrollingComp: PROJECT.PatrollingComponent;
        private tree: PROJECT.BehaviorTree;
        private patrolPointKey: string;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BTTask_GetNextPatrolPoint") {
            super(transform, scene, properties, alias);
            
            if (properties.tree) {
                this.tree = properties.tree;
                this.patrollingComp = this.tree.getComponent("PROJECT.PatrollingComponent") as PROJECT.PatrollingComponent;
            }
            if (properties.patrolPointKey) this.patrolPointKey = properties.patrolPointKey;
        }
        
        protected execute(): PROJECT.NodeResult {
            if (this.patrollingComp != null && this.patrollingComp.getNextPatrolPoint()) {
                const point = this.patrollingComp.getNextPatrolPoint();
                this.tree.blackboardData.setOrAddData(this.patrolPointKey, point);
                return PROJECT.NodeResult.Success;
            }
            
            return PROJECT.NodeResult.Failure;
        }
    }
}
