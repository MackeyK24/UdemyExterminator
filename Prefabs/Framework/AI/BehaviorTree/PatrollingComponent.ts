namespace PROJECT {
    export class PatrollingComponent extends TOOLKIT.ScriptComponent {
        private patrolPoints: BABYLON.TransformNode[];
        private currentPatrolPointIndex: number = -1;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.PatrollingComponent") {
            super(transform, scene, properties, alias);
        }
        
        public getNextPatrolPoint(point: BABYLON.Vector3): boolean {
            if (!this.patrolPoints || this.patrolPoints.length === 0) {
                point.set(0, 0, 0);
                return false;
            }
            
            this.currentPatrolPointIndex = (this.currentPatrolPointIndex + 1) % this.patrolPoints.length;
            
            const patrolPoint = this.patrolPoints[this.currentPatrolPointIndex];
            if (patrolPoint && patrolPoint.position) {
                point.copyFrom(patrolPoint.position);
                return true;
            }
            
            point.set(0, 0, 0);
            return false;
        }
    }
}
