/**
 * Scaner - Creates an expanding scan effect that detects objects
 */
namespace PROJECT {
    export class Scaner extends TOOLKIT.ScriptComponent {
        private scanerPivot: BABYLON.TransformNode = null;
        private scanRange: number = 5.0;
        private scanDuration: number = 1.0;
        
        private onScanDetectionUpdatedCallbacks: ((newDetection: BABYLON.TransformNode) => void)[] = [];
        
        private scanAnimation: BABYLON.Animation = null;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.Scaner");
        }
        
        public setScanRange(scanRange: number): void {
            this.scanRange = scanRange;
        }
        
        public setScanDuration(duration: number): void {
            this.scanDuration = duration;
        }
        
        public addChildAttached(newChild: BABYLON.TransformNode): void {
            if (this.scanerPivot) {
                newChild.parent = this.scanerPivot;
                newChild.position = BABYLON.Vector3.Zero();
            }
        }
        
        public startScan(): void {
            if (!this.scanerPivot) return;
            
            this.scanerPivot.scaling = BABYLON.Vector3.Zero();
            
            const scanAnimation = new BABYLON.Animation(
                "scanGrowth",
                "scaling",
                30, // frames per second
                BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
            );
            
            const keyFrames = [];
            
            keyFrames.push({
                frame: 0,
                value: BABYLON.Vector3.Zero()
            });
            
            keyFrames.push({
                frame: this.scanDuration * 30, // duration in frames
                value: new BABYLON.Vector3(this.scanRange, this.scanRange, this.scanRange)
            });
            
            scanAnimation.setKeys(keyFrames);
            
            this.scanAnimation = scanAnimation;
            
            this.scene.beginAnimation(this.scanerPivot, 0, this.scanDuration * 30, false, 1.0, () => {
                this.destroy();
            });
            
            this.setupScanCollisionDetection();
        }
        
        private setupScanCollisionDetection(): void {
            
            const observer = this.scene.onBeforeRenderObservable.add(() => {
                
            });
            
            setTimeout(() => {
                this.scene.onBeforeRenderObservable.remove(observer);
            }, this.scanDuration * 1000);
        }
        
        public registerOnScanDetectionUpdated(callback: (newDetection: BABYLON.TransformNode) => void): void {
            this.onScanDetectionUpdatedCallbacks.push(callback);
        }
        
        protected onDestroy(): void {
            if (this.scanAnimation) {
                this.scene.stopAnimation(this.scanerPivot);
            }
        }
    }
}
