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
            
            if (properties.thumbStickTrans) this.thumbStickTrans = properties.thumbStickTrans;
            if (properties.backgroundTrans) this.backgroundTrans = properties.backgroundTrans;
            if (properties.centerTrans) this.centerTrans = properties.centerTrans;
        }
        
        protected start(): void {
            const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);
            
            this.backgroundTrans.onPointerDownObservable.add((eventData) => {
                this.onPointerDown(eventData);
            });
            
            this.backgroundTrans.onPointerMoveObservable.add((eventData) => {
                if (eventData.buttonDown) {
                    this.onDrag(eventData);
                }
            });
            
            this.backgroundTrans.onPointerUpObservable.add((eventData) => {
                this.onPointerUp(eventData);
            });
        }
        
        public onDrag(eventData: BABYLON.PointerInfo): void {
            const touchPos = new BABYLON.Vector2(eventData.event.clientX, eventData.event.clientY);
            const centerPos = new BABYLON.Vector2(
                (this.backgroundTrans as any).centerX, 
                (this.backgroundTrans as any).centerY
            );
            
            const localOffset = touchPos.subtract(centerPos);
            const maxRadius = (this.backgroundTrans as any).width / 2;
            
            if (localOffset.length() > maxRadius) {
                localOffset.normalize().scaleInPlace(maxRadius);
            }
            
            const inputVal = new BABYLON.Vector2(
                localOffset.x / maxRadius,
                localOffset.y / maxRadius
            );
            
            (this.thumbStickTrans as any).left = centerPos.x + localOffset.x;
            (this.thumbStickTrans as any).top = centerPos.y + localOffset.y;
            
            for (let i = 0; i < this.onStickValueUpdated.length; i++) {
                this.onStickValueUpdated[i](inputVal);
            }
            
            this.bWasDragging = true;
        }
        
        public onPointerDown(eventData: BABYLON.PointerInfo): void {
            const position = new BABYLON.Vector2(eventData.event.clientX, eventData.event.clientY);
            
            (this.backgroundTrans as any).left = position.x;
            (this.backgroundTrans as any).top = position.y;
            (this.thumbStickTrans as any).left = position.x;
            (this.thumbStickTrans as any).top = position.y;
            
            this.bWasDragging = false;
        }
        
        public onPointerUp(eventData: BABYLON.PointerInfo): void {
            (this.backgroundTrans as any).left = (this.centerTrans as any).left;
            (this.backgroundTrans as any).top = (this.centerTrans as any).top;
            (this.thumbStickTrans as any).left = (this.backgroundTrans as any).left;
            (this.thumbStickTrans as any).top = (this.backgroundTrans as any).top;
            
            const zeroVector = new BABYLON.Vector2(0, 0);
            for (let i = 0; i < this.onStickValueUpdated.length; i++) {
                this.onStickValueUpdated[i](zeroVector);
            }
            
            if (!this.bWasDragging) {
                for (let i = 0; i < this.onStickTaped.length; i++) {
                    this.onStickTaped[i]();
                }
            }
        }
    }
}
