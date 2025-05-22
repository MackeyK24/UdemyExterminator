namespace PROJECT {
    export class Shaker extends TOOLKIT.ScriptComponent {
        private shakeMag: number = 0.1;
        private shakeDuration: number = 0.1;
        private shakeTransform: BABYLON.TransformNode;
        private shakeRecoverySpeed: number = 10.0;
        
        private shakeTimeoutId: number = null;
        private isShaking: boolean = false;
        
        private origionalPos: BABYLON.Vector3;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.Shaker") {
            super(transform, scene, properties, alias);
        }
        
        protected start(): void {
            this.origionalPos = this.transform.position.clone();
        }
        
        public startShake(): void {
            if (this.shakeTimeoutId == null) {
                this.isShaking = true;
                this.shakeTimeoutId = window.setTimeout(() => {
                    this.isShaking = false;
                    this.shakeTimeoutId = null;
                }, this.shakeDuration * 1000);
            }
        }
        
        protected late(): void {
            this.processShake();
        }
        
        private processShake(): void {
            if (this.isShaking) {
                const randomX = Math.random();
                const randomY = Math.random();
                const randomZ = Math.random();
                const randomSign = Math.random() > 0.5 ? -1 : 1;
                
                const shakeAmt = new BABYLON.Vector3(
                    randomX, 
                    randomY, 
                    randomZ
                ).scale(this.shakeMag * randomSign);
                
                if (this.shakeTransform) {
                    this.shakeTransform.position.addInPlace(shakeAmt);
                }
            } else {
                if (this.shakeTransform) {
                    const currentPos = this.shakeTransform.position;
                    const newPos = BABYLON.Vector3.Lerp(
                        currentPos,
                        this.origionalPos,
                        this.getDeltaTime() * this.shakeRecoverySpeed
                    );
                    
                    this.shakeTransform.position = newPos;
                }
            }
        }
    }
}
