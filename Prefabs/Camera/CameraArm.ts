namespace PROJECT {
    export class CameraArm extends TOOLKIT.ScriptComponent {
        private armLength: number;
        private child: BABYLON.TransformNode;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.CameraArm") {
            super(transform, scene, properties, alias);
            
            if (properties.armLength) this.armLength = properties.armLength;
            if (properties.child) this.child = properties.child;
        }

        protected update(): void {
            this.child.position = this.transform.position.subtract(this.child.forward.scale(this.armLength));
        }
    }
}
