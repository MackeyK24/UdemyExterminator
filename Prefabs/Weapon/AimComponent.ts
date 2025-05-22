namespace PROJECT {
    export class AimComponent extends TOOLKIT.ScriptComponent {
        private muzzle: BABYLON.TransformNode;
        private aimRange: number = 1000;
        private aimMask: number;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.AimComponent") {
            super(transform, scene, properties, alias);
        }
        
        public getAimTarget(aimDir: BABYLON.Vector3): BABYLON.TransformNode {
            const aimStart = this.muzzle.position;
            aimDir.copyFrom(this.getAimDir());
            
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
            const aimDir = new BABYLON.Vector3(muzzleDir.x, 0, muzzleDir.z);
            return aimDir.normalize();
        }
    }
}
