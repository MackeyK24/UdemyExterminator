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
            
            if (properties.abilityComponent) this.abilityComponent = properties.abilityComponent;
            if (properties.root) this.root = properties.root;
            if (properties.layoutGrp) this.layoutGrp = properties.layoutGrp;
            if (properties.abilityUIPrefab) this.abilityUIPrefab = properties.abilityUIPrefab;
            if (properties.scaleRange) this.scaleRange = properties.scaleRange;
            if (properties.highlightSize) this.highlightSize = properties.highlightSize;
            if (properties.scaleSpeed) this.scaleSpeed = properties.scaleSpeed;
        }
        
        protected awake(): void {
            this.abilityComponent.onNewAbilityAdded.push(this.addAbility.bind(this));
        }
        
        private addAbility(newAbility: PROJECT.Ability): void {
            const newAbilityUI = TOOLKIT.SceneManager.InstantiatePrefab(
                this.abilityUIPrefab.transform, 
                this.scene, 
                this.root
            ) as PROJECT.AbilityUI;
            
            newAbilityUI.init(newAbility);
            this.abilityUIs.push(newAbilityUI);
        }
        
        protected update(): void {
            if (this.touchData != null) {
                this.getUIUnderPointer(this.touchData, (ability) => {
                    this.hightlightedAbility = ability;
                });
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
            
            const touchVerticalPos = touchData.position.y;
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
        
        public onPointerDown(eventData: any): void {
            this.touchData = eventData;
            this.goalScale = BABYLON.Vector3.One().scale(this.highlightSize);
        }
        
        public onPointerUp(eventData: any): void {
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
        
        private getUIUnderPointer(eventData: any, callback: (abilityUI: PROJECT.AbilityUI) => void): boolean {
            
            
            for (const abilityUI of this.abilityUIs) {
                callback(abilityUI);
                return true;
            }
            
            return false;
        }
    }
}
