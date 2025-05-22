namespace PROJECT {
    export class CameraController extends TOOLKIT.ScriptComponent {
        private followTrans: BABYLON.TransformNode;
        private turnSpeed: number = 2;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.CameraController") {
            super(transform, scene, properties, alias);
            
            if (properties.followTrans) this.followTrans = properties.followTrans;
            if (properties.turnSpeed) this.turnSpeed = properties.turnSpeed;
        }

        protected late(): void {
            this.transform.position = this.followTrans.position;
        }

        public addYawInput(amt: number): void {
            this.transform.rotate(BABYLON.Vector3.Up(), amt * this.getDeltaTime() * this.turnSpeed);
        }
    }
}
