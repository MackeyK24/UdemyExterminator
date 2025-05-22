namespace PROJECT {
    export class BTTaskGroup_Patrolling extends PROJECT.BTTask_Group {
        private acceptableDistance: number;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BTTaskGroup_Patrolling") {
            super(transform, scene, properties, alias);
        }
        
        public initialize(tree: PROJECT.BehaviorTree, acceptableDistance: number = 3.0): void {
            super.initialize(tree);
            this.acceptableDistance = acceptableDistance;
        }
        
        protected override constructTree(root: { node: PROJECT.BTNode }): void {
            const patrollingSeq = new PROJECT.Sequencer(this.transform, this.scene);
            
            const getNextPatrolPoint = new PROJECT.BTTask_GetNextPatrolPoint(this.transform, this.scene);
            getNextPatrolPoint.initialize(this.tree, "PatrolPoint");
            
            const moveToPatrolPoint = new PROJECT.BTTask_MoveToLoc(this.transform, this.scene);
            moveToPatrolPoint.initialize(this.tree, "PatrolPoint", this.acceptableDistance);
            
            const waitAtPatrolPoint = new PROJECT.BTTask_Wait(this.transform, this.scene);
            waitAtPatrolPoint.initialize(2.0);
            
            patrollingSeq.addChild(getNextPatrolPoint);
            patrollingSeq.addChild(moveToPatrolPoint);
            patrollingSeq.addChild(waitAtPatrolPoint);
            
            root.node = patrollingSeq;
        }
    }
}
