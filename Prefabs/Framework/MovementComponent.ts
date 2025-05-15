/**
 * MovementComponent - Handles rotation towards a target direction
 */
namespace PROJECT {
    export class MovementComponent extends TOOLKIT.ScriptComponent {
        private turnSpeed: number = 8.0;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.MovementComponent");
        }
        
        public rotateTowards(aimDir: BABYLON.Vector3): number {
            let currentTurnSpeed: number = 0;
            
            if (aimDir.length() !== 0) {
                const prevRot = this.transform.rotationQuaternion.clone();
                
                const turnLerpAlpha = this.turnSpeed * this.getDeltaTime();
                
                const targetRotation = BABYLON.Quaternion.RotationYawPitchRoll(
                    Math.atan2(aimDir.x, aimDir.z),
                    0,
                    0
                );
                
                BABYLON.Quaternion.SlerpToRef(
                    this.transform.rotationQuaternion,
                    targetRotation,
                    turnLerpAlpha,
                    this.transform.rotationQuaternion
                );
                
                const currentRot = this.transform.rotationQuaternion;
                const dir = BABYLON.Vector3.Dot(aimDir, this.transform.right) > 0 ? 1 : -1;
                const rotationDelta = BABYLON.Quaternion.Angle(prevRot, currentRot) * dir;
                currentTurnSpeed = rotationDelta / this.getDeltaTime();
            }
            
            return currentTurnSpeed;
        }
    }
}
