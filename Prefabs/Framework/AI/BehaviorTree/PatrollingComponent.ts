namespace PROJECT {
    export class PatrollingComponent extends TOOLKIT.ScriptComponent {
        private patrolPoints: BABYLON.TransformNode[] = [];
        private currentPatrolPointIndex: number = -1;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.PatrollingComponent") {
            super(transform, scene, properties, alias);
            
            if (properties.patrolPoints) this.patrolPoints = properties.patrolPoints;
        }
        
        public getNextPatrolPoint(point: BABYLON.Vector3): boolean {
            if (this.patrolPoints.length === 0) return false;
            
            this.currentPatrolPointIndex = (this.currentPatrolPointIndex + 1) % this.patrolPoints.length;
            point.copyFrom(this.patrolPoints[this.currentPatrolPointIndex].position);
            return true;
        }
    }
}
