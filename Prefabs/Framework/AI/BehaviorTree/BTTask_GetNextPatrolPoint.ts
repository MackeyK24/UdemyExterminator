namespace PROJECT {
    export class BTTask_GetNextPatrolPoint extends PROJECT.BTNode {
        private patrollingComp: PROJECT.PatrollingComponent;
        private tree: PROJECT.BehaviorTree;
        private patrolPointKey: string;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BTTask_GetNextPatrolPoint") {
            super(transform, scene, properties, alias);
        }
        
        public initialize(tree: PROJECT.BehaviorTree, patrolPointKey: string): void {
            this.patrollingComp = TOOLKIT.SceneManager.FindScriptComponent(tree.transform, "PROJECT.PatrollingComponent") as PROJECT.PatrollingComponent;
            this.tree = tree;
            this.patrolPointKey = patrolPointKey;
        }
        
        protected override execute(): PROJECT.NodeResult {
            if (this.patrollingComp) {
                const point = new BABYLON.Vector3(0, 0, 0);
                if (this.patrollingComp.getNextPatrolPoint(point)) {
                    this.tree.blackboard.setOrAddData(this.patrolPointKey, point);
                    return PROJECT.NodeResult.Success;
                }
            }
            
            return PROJECT.NodeResult.Failure;
        }
    }
}
