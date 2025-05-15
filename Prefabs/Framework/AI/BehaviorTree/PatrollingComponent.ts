/**
 * PatrollingComponent - Component that manages patrol points for AI behavior
 */
namespace PROJECT {
    export class PatrollingComponent extends TOOLKIT.ScriptComponent {
        private patrolPoints: BABYLON.TransformNode[] = [];
        private currentPatrolPointIndex: number = -1;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.PatrollingComponent");
        }
        
        public getNextPatrolPoint(): BABYLON.Vector3 {
            if (this.patrolPoints.length === 0) {
                return null;
            }
            
            this.currentPatrolPointIndex = (this.currentPatrolPointIndex + 1) % this.patrolPoints.length;
            return this.patrolPoints[this.currentPatrolPointIndex].position;
        }
        
        public setPatrolPoints(points: BABYLON.TransformNode[]): void {
            this.patrolPoints = points;
        }
    }
}
