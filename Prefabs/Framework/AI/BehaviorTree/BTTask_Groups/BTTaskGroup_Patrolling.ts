namespace PROJECT {
    export class BTTaskGroup_Patrolling extends PROJECT.BTTask_Group {
        private acceptableDistance: number;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BTTaskGroup_Patrolling") {
            super(transform, scene, properties, alias);
            
            if (properties.tree) this.tree = properties.tree;
            if (properties.acceptableDistance) this.acceptableDistance = properties.acceptableDistance;
            else this.acceptableDistance = 3;
        }
        
        protected constructTree(root: PROJECT.BTNode): void {
            const patrollingSeq = new PROJECT.Sequencer(this.transform, this.scene);
            
            const getNextPatrolPoint = new PROJECT.BTTask_GetNextPatrolPoint(this.transform, this.scene, {
                tree: this.tree,
                key: "PatrolPoint"
            });
            
            const moveToPatrolPoint = new PROJECT.BTTask_MoveToLoc(this.transform, this.scene, {
                tree: this.tree,
                locKey: "PatrolPoint",
                acceptableDistance: this.acceptableDistance
            });
            
            const waitAtPatrolPoint = new PROJECT.BTTask_Wait(this.transform, this.scene, {
                waitTime: 2.0
            });
            
            patrollingSeq.addChild(getNextPatrolPoint);
            patrollingSeq.addChild(moveToPatrolPoint);
            patrollingSeq.addChild(waitAtPatrolPoint);
            
            root = patrollingSeq;
        }
    }
}
