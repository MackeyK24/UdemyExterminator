namespace PROJECT {
    export class PlayerCreditBar extends TOOLKIT.ScriptComponent {
        private shopBtn: BABYLON.GUI.Button;
        private uiManager: PROJECT.UIManager;
        private creditComp: PROJECT.CreditComponent;
        private creditText: BABYLON.GUI.TextBlock;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.PlayerCreditBar") {
            super(transform, scene, properties, alias);
            
            if (properties.shopBtn) this.shopBtn = properties.shopBtn;
            if (properties.uiManager) this.uiManager = properties.uiManager;
            if (properties.creditComp) this.creditComp = properties.creditComp;
            if (properties.creditText) this.creditText = properties.creditText;
        }
        
        protected start(): void {
            this.shopBtn.onPointerClickObservable.add(() => {
                this.pullOutShop();
            });
            
            this.creditComp.onCreditChanged.push(this.updateCredit.bind(this));
            this.updateCredit(this.creditComp.credit);
        }
        
        private updateCredit(newCredit: number): void {
            this.creditText.text = newCredit.toString();
        }
        
        private pullOutShop(): void {
            this.uiManager.swithToShop();
        }
    }
}
