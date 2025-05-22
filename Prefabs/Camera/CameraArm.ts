namespace PROJECT {
    export class CameraArm extends TOOLKIT.ScriptComponent {
        private armLength: number;
        private child: BABYLON.TransformNode;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.CameraArm") {
            super(transform, scene, properties, alias);
        }
        
        protected update(): void {
            if (this.child) {
                const forwardDirection = this.child.forward.scale(this.armLength);
                this.child.position = this.transform.position.subtract(forwardDirection);
            }
        }
    }
}
