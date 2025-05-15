/**
 * PlayerCreditBar - UI component for displaying player credits and shop interaction
 */
namespace PROJECT {
    export class PlayerCreditBar extends TOOLKIT.ScriptComponent {
        private shopBtn: BABYLON.GUI.Button = null;
        private uiManager: PROJECT.UIManager = null;
        private creditComp: PROJECT.CreditComponent = null;
        private creditText: BABYLON.GUI.TextBlock = null;
        private onCreditChangedCallback: (newCredit: number) => void = null;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.PlayerCreditBar");
        }
        
        protected start(): void {
            if (this.shopBtn) {
                this.shopBtn.onPointerClickObservable.add(this.pullOutShop.bind(this));
            }
            
            if (this.creditComp) {
                this.onCreditChangedCallback = this.updateCredit.bind(this);
                this.creditComp.onCreditChangedCallbacks.push(this.onCreditChangedCallback);
                this.updateCredit(this.creditComp.credit);
            }
        }
        
        private updateCredit(newCredit: number): void {
            if (this.creditText) {
                this.creditText.text = newCredit.toString();
            }
        }
        
        private pullOutShop(): void {
            if (this.uiManager) {
                this.uiManager.swithToShop();
            }
        }
    }
}
