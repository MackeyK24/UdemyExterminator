namespace PROJECT {
    export class Shaker extends TOOLKIT.ScriptComponent {
        private shakeMag: number = 0.1;
        private shakeDuration: number = 0.1;
        private shakeTransform: BABYLON.TransformNode;
        private shakeRecoverySpeed: number = 10.0;
        
        private shakeTimeout: number = null;
        private isShaking: boolean = false;
        private originalPos: BABYLON.Vector3;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.Shaker") {
            super(transform, scene, properties, alias);
            
            if (properties.shakeMag) this.shakeMag = properties.shakeMag;
            if (properties.shakeDuration) this.shakeDuration = properties.shakeDuration;
            if (properties.shakeTransform) this.shakeTransform = properties.shakeTransform;
            if (properties.shakeRecoverySpeed) this.shakeRecoverySpeed = properties.shakeRecoverySpeed;
        }

        protected start(): void {
            this.originalPos = this.transform.position.clone();
        }

        public startShake(): void {
            if (this.shakeTimeout === null) {
                this.isShaking = true;
                this.shakeTimeout = setTimeout(() => {
                    this.isShaking = false;
                    this.shakeTimeout = null;
                }, this.shakeDuration * 1000);
            }
        }

        protected late(): void {
            this.processShake();
        }

        private processShake(): void {
            if (this.isShaking) {
                const shakeAmt = new BABYLON.Vector3(
                    Math.random(), 
                    Math.random(), 
                    Math.random()
                ).scale(this.shakeMag * (Math.random() > 0.5 ? -1 : 1));
                
                this.shakeTransform.position.addInPlace(shakeAmt);
            } else {
                this.shakeTransform.position = BABYLON.Vector3.Lerp(
                    this.shakeTransform.position, 
                    this.originalPos, 
                    this.getDeltaTime() * this.shakeRecoverySpeed
                );
            }
        }
    }
}
