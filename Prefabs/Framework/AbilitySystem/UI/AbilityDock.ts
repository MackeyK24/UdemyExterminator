/**
 * AbilityDock - UI component for managing ability icons with scaling and interaction
 */
namespace PROJECT {
    export class AbilityDock extends TOOLKIT.ScriptComponent {
        private abilityComponent: PROJECT.AbilityComponent = null;
        private root: BABYLON.GUI.Container = null;
        private layoutGrp: BABYLON.GUI.StackPanel = null;
        private abilityUIPrefab: PROJECT.AbilityUI = null;
        
        private scaleRange: number = 200.0;
        private highlightSize: number = 1.5;
        private scaleSpeed: number = 20.0;
        
        private goalScale: BABYLON.Vector3 = BABYLON.Vector3.One();
        
        private abilityUIs: PROJECT.AbilityUI[] = [];
        
        private touchData: any = null;
        private highlightedAbility: PROJECT.AbilityUI = null;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.AbilityDock");
        }
        
        protected awake(): void {
            if (this.abilityComponent) {
                this.abilityComponent.onNewAbilityAddedCallbacks.push(this.addAbility.bind(this));
            }
        }
        
        private addAbility(newAbility: PROJECT.Ability): void {
            if (!this.abilityUIPrefab || !this.root) return;
            
            const newAbilityUI = TOOLKIT.SceneManager.InstantiatePrefabFromContainer(
                this.root, 
                this.abilityUIPrefab.transform.name, 
                "AbilityUI_" + this.abilityUIs.length
            );
            
            const abilityUIComponent = newAbilityUI.getComponent("PROJECT.AbilityUI") as PROJECT.AbilityUI;
            if (abilityUIComponent) {
                abilityUIComponent.init(newAbility);
                this.abilityUIs.push(abilityUIComponent);
            }
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
            if (this.highlightedAbility) {
                this.highlightedAbility.activateAbility();
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
            
            this.highlightedAbility = null;
            
            if (this.scene && this.scene.getEngine().getRenderingCanvas()) {
                const pickInfo = this.scene.pick(
                    eventData.position.x,
                    eventData.position.y,
                    (mesh) => {
                        return true;
                    }
                );
                
                if (pickInfo.hit && pickInfo.pickedMesh) {
                    let node: BABYLON.Node = pickInfo.pickedMesh;
                    while (node) {
                        const abilityUI = this.getComponentFromNode(node, "PROJECT.AbilityUI") as PROJECT.AbilityUI;
                        if (abilityUI) {
                            this.highlightedAbility = abilityUI;
                            return true;
                        }
                        node = node.parent;
                    }
                }
            }
            
            return false;
        }
        
        private getComponentFromNode(node: BABYLON.Node, componentType: string): TOOLKIT.ScriptComponent {
            if (!node) return null;
            
            return null;
        }
    }
}
