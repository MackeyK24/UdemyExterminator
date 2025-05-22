namespace PROJECT {
    export class JoyStick extends TOOLKIT.ScriptComponent {
        private thumbStickTrans: BABYLON.GUI.Control;
        private backgroundTrans: BABYLON.GUI.Control;
        private centerTrans: BABYLON.GUI.Control;
        
        public onStickValueUpdated: ((inputVal: BABYLON.Vector2) => void)[] = [];
        public onStickTaped: (() => void)[] = [];
        
        private bWasDragging: boolean = false;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.JoyStick") {
            super(transform, scene, properties, alias);
        }
        
        public onDrag(eventData: any): void {
            const touchPos = new BABYLON.Vector2(eventData.x, eventData.y);
            const centerPos = new BABYLON.Vector2(this.backgroundTrans.centerX, this.backgroundTrans.centerY);
            
            const localOffset = touchPos.subtract(centerPos);
            const maxRadius = (this.backgroundTrans.widthInPixels / 2);
            
            if (localOffset.length() > maxRadius) {
                localOffset.normalize().scaleInPlace(maxRadius);
            }
            
            const inputVal = localOffset.scale(1 / maxRadius);
            
            this.thumbStickTrans.left = centerPos.x + localOffset.x + "px";
            this.thumbStickTrans.top = centerPos.y + localOffset.y + "px";
            
            for (const callback of this.onStickValueUpdated) {
                callback(inputVal);
            }
            
            this.bWasDragging = true;
        }
        
        public onPointerDown(eventData: any): void {
            this.backgroundTrans.left = eventData.x + "px";
            this.backgroundTrans.top = eventData.y + "px";
            
            this.thumbStickTrans.left = eventData.x + "px";
            this.thumbStickTrans.top = eventData.y + "px";
            
            this.bWasDragging = false;
        }
        
        public onPointerUp(eventData: any): void {
            this.backgroundTrans.left = this.centerTrans.left;
            this.backgroundTrans.top = this.centerTrans.top;
            this.thumbStickTrans.left = this.backgroundTrans.left;
            this.thumbStickTrans.top = this.backgroundTrans.top;
            
            for (const callback of this.onStickValueUpdated) {
                callback(BABYLON.Vector2.Zero());
            }
            
            if (!this.bWasDragging) {
                for (const callback of this.onStickTaped) {
                    callback();
                }
            }
        }
        
        protected start(): void {
        }
    }
}
