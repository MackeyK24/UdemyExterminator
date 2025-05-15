/**
 * AimComponent - Handles aiming functionality for weapons
 */
namespace PROJECT {
    export class AimComponent extends TOOLKIT.ScriptComponent {
        private muzzle: BABYLON.TransformNode = null;
        private aimRange: number = 1000;
        private aimMask: number = 0;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.AimComponent");
        }

        public getAimTarget(aimDir: BABYLON.Vector3): BABYLON.TransformNode {
            const aimStart = this.muzzle.position;
            aimDir = this.getAimDir();
            
            const ray = new BABYLON.Ray(aimStart, aimDir, this.aimRange);
            const hit = this.scene.pickWithRay(ray, (mesh) => {
                return (mesh.layerMask & this.aimMask) !== 0;
            });
            
            if (hit && hit.pickedMesh) {
                return hit.pickedMesh;
            }
            
            return null;
        }


        private getAimDir(): BABYLON.Vector3 {
            const muzzleDir = this.muzzle.forward;
            return new BABYLON.Vector3(muzzleDir.x, 0, muzzleDir.z).normalize();
        }
    }
}
