namespace PROJECT {
    export class CameraController extends TOOLKIT.ScriptComponent {
        private followTrans: BABYLON.TransformNode;
        private turnSpeed: number = 2.0;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.CameraController") {
            super(transform, scene, properties, alias);
        }
        
        protected late(): void {
            if (this.followTrans) {
                this.transform.position = this.followTrans.position.clone();
            }
        }
        
        public addYawInput(amt: number): void {
            this.transform.rotate(BABYLON.Vector3.Up(), amt * this.getDeltaTime() * this.turnSpeed);
        }
    }
}
