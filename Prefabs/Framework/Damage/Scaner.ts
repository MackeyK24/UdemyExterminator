namespace PROJECT {
    export class Scaner extends TOOLKIT.ScriptComponent {
        private scanerPivot: BABYLON.TransformNode;
        
        public onScanDetectionUpdated: ((newDetection: BABYLON.TransformNode) => void)[] = [];
        
        private scanRange: number = 0;
        private scaneDuration: number = 0;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.Scaner") {
            super(transform, scene, properties, alias);
        }
        
        public setScanRange(scanRange: number): void {
            this.scanRange = scanRange;
        }
        
        public setScanDuration(duration: number): void {
            this.scaneDuration = duration;
        }
        
        public addChildAttached(newChild: BABYLON.TransformNode): void {
            newChild.parent = this.scanerPivot;
            newChild.position.set(0, 0, 0);
        }
        
        public startScan(): void {
            this.scanerPivot.scaling.set(0, 0, 0);
            this.startScanCoroutine();
        }
        
        private startScanCoroutine(): void {
            const scanGrowthRate = this.scanRange / this.scaneDuration;
            let startTime = 0;
            
            const scanInterval = window.setInterval(() => {
                startTime += this.getDeltaTime();
                
                const growthAmount = scanGrowthRate * this.getDeltaTime();
                this.scanerPivot.scaling.addInPlace(new BABYLON.Vector3(growthAmount, growthAmount, growthAmount));
                
                if (startTime >= this.scaneDuration) {
                    window.clearInterval(scanInterval);
                    
                    this.transform.dispose();
                }
            }, 16); // Approximately 60fps
        }
        
        protected start(): void {
            if (this.transform.physicsBody) {
                this.transform.physicsBody.onCollideEvent = (collider) => {
                    for (const callback of this.onScanDetectionUpdated) {
                        callback(collider);
                    }
                };
            }
        }
    }
}
