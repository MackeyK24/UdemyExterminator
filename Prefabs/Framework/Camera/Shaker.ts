/**
 * Shaker - Applies random shake effects to a transform
 */
namespace PROJECT {
    export class Shaker extends TOOLKIT.ScriptComponent {
        private shakeMag: number = 0.1;
        private shakeDuration: number = 0.1;
        private shakeTransform: BABYLON.TransformNode = null;
        private shakeRecoverySpeed: number = 10.0;
        
        private shakeTimeoutId: number = null;
        private isShaking: boolean = false;
        
        private originalPos: BABYLON.Vector3 = null;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.Shaker");
        }
        
        protected start(): void {
            if (this.shakeTransform) {
                this.originalPos = this.shakeTransform.position.clone();
            } else {
                this.originalPos = this.transform.position.clone();
            }
        }
        
        public startShake(): void {
            if (this.shakeTimeoutId === null) {
                this.isShaking = true;
                
                this.shakeTimeoutId = setTimeout(() => {
                    this.isShaking = false;
                    this.shakeTimeoutId = null;
                }, this.shakeDuration * 1000);
            }
        }
        
        protected late(): void {
            this.processShake();
        }
        
        private processShake(): void {
            const targetTransform = this.shakeTransform || this.transform;
            
            if (this.isShaking) {
                const shakeAmt = new BABYLON.Vector3(
                    Math.random(),
                    Math.random(),
                    Math.random()
                ).scale(this.shakeMag * (Math.random() > 0.5 ? -1 : 1));
                
                targetTransform.position.addInPlace(shakeAmt);
            } else {
                const lerpFactor = this.getDeltaTime() * this.shakeRecoverySpeed;
                
                BABYLON.Vector3.LerpToRef(
                    targetTransform.position,
                    this.originalPos,
                    lerpFactor,
                    targetTransform.position
                );
            }
        }
        
        protected onDestroy(): void {
            if (this.shakeTimeoutId !== null) {
                clearTimeout(this.shakeTimeoutId);
                this.shakeTimeoutId = null;
            }
        }
    }
}
