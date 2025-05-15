/**
 * JoyStick - Virtual joystick UI component with touch/pointer event handling
 */
namespace PROJECT {
    export class JoyStick extends TOOLKIT.ScriptComponent {
        private thumbStickTrans: BABYLON.GUI.Control = null;
        private backgroundTrans: BABYLON.GUI.Control = null;
        private centerTrans: BABYLON.GUI.Control = null;
        
        private onStickValueUpdatedCallbacks: ((inputVal: BABYLON.Vector2) => void)[] = [];
        private onStickTapedCallbacks: (() => void)[] = [];
        
        private bWasDragging: boolean = false;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.JoyStick");
        }
        
        protected start(): void {
            if (this.backgroundTrans) {
                this.backgroundTrans.onPointerDownObservable.add(this.onPointerDown.bind(this));
                this.backgroundTrans.onPointerUpObservable.add(this.onPointerUp.bind(this));
                this.backgroundTrans.onPointerMoveObservable.add(this.onDrag.bind(this));
            }
        }
        
        private onDrag(eventData: BABYLON.PointerInfo): void {
            if (!eventData.pickInfo.hit) return;
            
            const touchPos = new BABYLON.Vector2(eventData.event.clientX, eventData.event.clientY);
            const centerPos = new BABYLON.Vector2(
                this.backgroundTrans.centerX, 
                this.backgroundTrans.centerY
            );
            
            const localOffset = touchPos.subtract(centerPos);
            const maxRadius = (this.backgroundTrans.widthInPixels / 2);
            
            if (localOffset.length() > maxRadius) {
                localOffset.normalize().scaleInPlace(maxRadius);
            }
            
            const inputVal = localOffset.scale(1 / maxRadius);
            
            if (this.thumbStickTrans) {
                this.thumbStickTrans.left = centerPos.x + localOffset.x + "px";
                this.thumbStickTrans.top = centerPos.y + localOffset.y + "px";
            }
            
            for (const callback of this.onStickValueUpdatedCallbacks) {
                callback(inputVal);
            }
            
            this.bWasDragging = true;
        }
        
        private onPointerDown(eventData: BABYLON.PointerInfo): void {
            if (!eventData.pickInfo.hit) return;
            
            const pointerPos = new BABYLON.Vector2(
                eventData.event.clientX,
                eventData.event.clientY
            );
            
            if (this.backgroundTrans) {
                this.backgroundTrans.left = pointerPos.x + "px";
                this.backgroundTrans.top = pointerPos.y + "px";
            }
            
            if (this.thumbStickTrans) {
                this.thumbStickTrans.left = pointerPos.x + "px";
                this.thumbStickTrans.top = pointerPos.y + "px";
            }
            
            this.bWasDragging = false;
        }
        
        private onPointerUp(eventData: BABYLON.PointerInfo): void {
            if (this.backgroundTrans && this.centerTrans) {
                this.backgroundTrans.left = this.centerTrans.left;
                this.backgroundTrans.top = this.centerTrans.top;
            }
            
            if (this.thumbStickTrans && this.backgroundTrans) {
                this.thumbStickTrans.left = this.backgroundTrans.left;
                this.thumbStickTrans.top = this.backgroundTrans.top;
            }
            
            const zeroVector = new BABYLON.Vector2(0, 0);
            for (const callback of this.onStickValueUpdatedCallbacks) {
                callback(zeroVector);
            }
            
            if (!this.bWasDragging) {
                for (const callback of this.onStickTapedCallbacks) {
                    callback();
                }
            }
        }
        
        public registerOnStickValueUpdated(callback: (inputVal: BABYLON.Vector2) => void): void {
            this.onStickValueUpdatedCallbacks.push(callback);
        }
        
        public registerOnStickTaped(callback: () => void): void {
            this.onStickTapedCallbacks.push(callback);
        }
    }
}
