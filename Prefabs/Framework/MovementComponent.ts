namespace PROJECT {
    export class MovementComponent extends TOOLKIT.ScriptComponent {
        private turnSpeed: number = 8;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.MovementComponent") {
            super(transform, scene, properties, alias);
        }

        public rotateTowards(aimDir: BABYLON.Vector3): number {
            let currentTurnSpeed: number = 0;
            if (aimDir.length() !== 0) {
                const prevRot: BABYLON.Quaternion = this.transform.rotationQuaternion.clone();
                
                const turnLerpAlpha: number = this.turnSpeed * this.getDeltaTime();
                const targetRotation: BABYLON.Quaternion = BABYLON.Quaternion.FromLookDirectionLH(aimDir, BABYLON.Vector3.Up());
                
                BABYLON.Quaternion.SlerpToRef(
                    this.transform.rotationQuaternion,
                    targetRotation,
                    turnLerpAlpha,
                    this.transform.rotationQuaternion
                );
                
                const currentRot: BABYLON.Quaternion = this.transform.rotationQuaternion;
                const dir: number = BABYLON.Vector3.Dot(aimDir, BABYLON.Vector3.Right().applyRotationQuaternion(this.transform.rotationQuaternion)) > 0 ? 1 : -1;
                const rotationDelta: number = BABYLON.Quaternion.Angle(prevRot, currentRot) * dir;
                currentTurnSpeed = rotationDelta / this.getDeltaTime();
            }
            return currentTurnSpeed;
        }
    }
}
