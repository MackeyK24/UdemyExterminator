/**
 * CameraArm - Positions a child camera at a specified distance
 */
namespace PROJECT {
    export class CameraArm extends TOOLKIT.ScriptComponent {
        private armLength: number = 0;
        private child: BABYLON.TransformNode = null;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.CameraArm");
        }
        
        protected update(): void {
            if (this.child) {
                this.child.position = this.transform.position.subtract(
                    this.child.forward.scale(this.armLength)
                );
            }
        }
    }
}
