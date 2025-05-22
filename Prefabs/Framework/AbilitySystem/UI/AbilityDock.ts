namespace PROJECT {
    export class AbilityDock extends TOOLKIT.ScriptComponent {
        private abilityComponent: PROJECT.AbilityComponent;
        private root: BABYLON.GUI.Container;
        private layoutGrp: BABYLON.GUI.StackPanel;
        private abilityUIPrefab: PROJECT.AbilityUI;
        
        private scaleRange: number = 200.0;
        private highlightSize: number = 1.5;
        private scaleSpeed: number = 20.0;
        
        private goalScale: BABYLON.Vector3 = BABYLON.Vector3.One();
        
        private abilityUIs: PROJECT.AbilityUI[] = [];
        
        private touchData: any;
        private hightlightedAbility: PROJECT.AbilityUI;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.AbilityDock") {
            super(transform, scene, properties, alias);
        }
        
        protected awake(): void {
            this.abilityComponent = this.getComponent("PROJECT.AbilityComponent") as PROJECT.AbilityComponent;
            this.abilityComponent.onNewAbilityAdded.push(this.addAbility.bind(this));
            
            if (this.root) {
                this.root.onPointerDownObservable.add(this.onPointerDown.bind(this));
                this.root.onPointerUpObservable.add(this.onPointerUp.bind(this));
            }
        }
        
        private addAbility(newAbility: PROJECT.Ability): void {
            const newAbilityUI = TOOLKIT.SceneManager.InstantiatePrefabFromContainer(this.root, this.abilityUIPrefab.transform.name, "") as PROJECT.AbilityUI;
            newAbilityUI.init(newAbility);
            this.abilityUIs.push(newAbilityUI);
        }
        
        protected update(): void {
            if (this.touchData) {
                this.getUIUnderPointer(this.touchData);
                this.arrangeScale(this.touchData);
            }
            
            this.transform.scaling = BABYLON.Vector3.Lerp(
                this.transform.scaling, 
                this.goalScale, 
                this.getDeltaTime() * this.scaleSpeed
            );
        }
        
        private arrangeScale(touchData: any): void {
            if (this.scaleRange === 0) return;
            
            const touchVerticalPos = touchData.y;
            
            for (const abilityUI of this.abilityUIs) {
                const abilityUIVerticalPos = abilityUI.transform.position.y;
                const distance = Math.abs(touchVerticalPos - abilityUIVerticalPos);
                
                if (distance > this.scaleRange) {
                    abilityUI.setScaleAmt(0);
                    continue;
                }
                
                const scaleAmt = (this.scaleRange - distance) / this.scaleRange;
                abilityUI.setScaleAmt(scaleAmt);
            }
        }
        
        private onPointerDown(eventData: any): void {
            this.touchData = { x: eventData.x, y: eventData.y };
            this.goalScale = BABYLON.Vector3.One().scale(this.highlightSize);
        }
        
        private onPointerUp(eventData: any): void {
            if (this.hightlightedAbility) {
                this.hightlightedAbility.activateAbility();
            }
            
            this.touchData = null;
            this.resetScale();
            this.goalScale = BABYLON.Vector3.One();
        }
        
        private resetScale(): void {
            for (const abilityUI of this.abilityUIs) {
                abilityUI.setScaleAmt(0);
            }
        }
        
        private getUIUnderPointer(eventData: any): boolean {
            
            this.hightlightedAbility = null;
            
            for (const abilityUI of this.abilityUIs) {
                const isOver = this.isPointerOverElement(eventData, abilityUI);
                
                if (isOver) {
                    this.hightlightedAbility = abilityUI;
                    return true;
                }
            }
            
            return false;
        }
        
        private isPointerOverElement(eventData: any, element: PROJECT.AbilityUI): boolean {
            
            return false;
        }
    }
}
