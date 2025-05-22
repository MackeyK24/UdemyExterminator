namespace PROJECT {
    export class Scaner extends TOOLKIT.ScriptComponent {
        private scanerPivot: BABYLON.TransformNode;
        
        public onScanDetectionUpdated: ((newDetection: BABYLON.TransformNode) => void)[] = [];
        
        private scanRange: number;
        private scaneDuration: number;
        private scanTimeout: number = null;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.Scaner") {
            super(transform, scene, properties, alias);
            
            if (properties.scanerPivot) this.scanerPivot = properties.scanerPivot;
            if (properties.scanRange) this.scanRange = properties.scanRange;
            if (properties.scaneDuration) this.scaneDuration = properties.scaneDuration;
        }

        public setScanRange(scanRange: number): void {
            this.scanRange = scanRange;
        }

        public setScanDuration(duration: number): void {
            this.scaneDuration = duration;
        }

        public addChildAttached(newChild: BABYLON.TransformNode): void {
            newChild.parent = this.scanerPivot;
            newChild.position = BABYLON.Vector3.Zero();
        }

        public startScan(): void {
            this.scanerPivot.scaling = BABYLON.Vector3.Zero();
            this.startScanCoroutine();
        }

        private startScanCoroutine(): void {
            const scanGrowthRate = this.scanRange / this.scaneDuration;
            let startTime = 0;
            
            const scanInterval = setInterval(() => {
                startTime += this.getDeltaTime();
                this.scanerPivot.scaling.addInPlace(BABYLON.Vector3.One().scale(scanGrowthRate * this.getDeltaTime()));
                
                if (startTime >= this.scaneDuration) {
                    clearInterval(scanInterval);
                    this.transform.dispose();
                }
            }, 16); // Approximately 60fps
        }

        public onTriggerEnter(other: BABYLON.AbstractMesh): void {
            if (this.onScanDetectionUpdated.length > 0) {
                for (let i = 0; i < this.onScanDetectionUpdated.length; i++) {
                    this.onScanDetectionUpdated[i](other);
                }
            }
        }
    }
}
