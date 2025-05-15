/**
 * ShopUI - UI component for managing shop functionality
 */
namespace PROJECT {
    export class ShopUI extends TOOLKIT.ScriptComponent {
        private shopSystem: PROJECT.ShopSystem = null;
        private shopItemUIPrefab: PROJECT.ShopItemUI = null;
        private shopList: BABYLON.GUI.Rectangle = null;
        private creditComp: PROJECT.CreditComponent = null;
        private uiManager: PROJECT.UIManager = null;
        
        private creditText: BABYLON.GUI.TextBlock = null;
        private backBtn: BABYLON.GUI.Button = null;
        private buyBtn: BABYLON.GUI.Button = null;
        
        private shopItems: PROJECT.ShopItemUI[] = [];
        private selectedItem: PROJECT.ShopItemUI = null;
        private onCreditChangedCallback: (newCredit: number) => void = null;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.ShopUI");
        }
        
        protected start(): void {
            this.initShopItems();
            
            if (this.backBtn) {
                this.backBtn.onPointerClickObservable.add(this.uiManager.switchToGameplayUI.bind(this.uiManager));
            }
            
            if (this.buyBtn) {
                this.buyBtn.onPointerClickObservable.add(this.tryPurchaseItem.bind(this));
            }
            
            if (this.creditComp) {
                this.onCreditChangedCallback = this.updateCredit.bind(this);
                this.creditComp.onCreditChangedCallbacks.push(this.onCreditChangedCallback);
                this.updateCredit(this.creditComp.credit);
            }
        }
        
        private tryPurchaseItem(): void {
            if (!this.selectedItem || !this.shopSystem.tryPurchase(this.selectedItem.getItem(), this.creditComp)) {
                return;
            }
            
            this.removeItem(this.selectedItem);
        }
        
        private removeItem(itemToRemove: PROJECT.ShopItemUI): void {
            const index = this.shopItems.indexOf(itemToRemove);
            if (index !== -1) {
                this.shopItems.splice(index, 1);
            }
            
            if (itemToRemove.transform) {
                itemToRemove.transform.dispose();
            }
        }
        
        private updateCredit(newCredit: number): void {
            if (this.creditText) {
                this.creditText.text = newCredit.toString();
            }
            
            this.refreshItems();
        }
        
        private refreshItems(): void {
            for (const shopItemUI of this.shopItems) {
                shopItemUI.refresh(this.creditComp.credit);
            }
        }
        
        private initShopItems(): void {
            const shopItems = this.shopSystem.getShopItems();
            
            for (const item of shopItems) {
                this.addShopItem(item);
            }
        }
        
        private addShopItem(item: PROJECT.ShopItem): void {
            const newItemUI = TOOLKIT.SceneManager.InstantiatePrefabFromContainer(
                this.shopList, 
                this.shopItemUIPrefab.transform.name, 
                "ShopItemUI"
            );
            
            const shopItemComponent = newItemUI.getComponent("PROJECT.ShopItemUI") as PROJECT.ShopItemUI;
            if (shopItemComponent) {
                shopItemComponent.init(item, this.creditComp.credit);
                shopItemComponent.onItemSelectedCallbacks.push(this.itemSelected.bind(this));
                this.shopItems.push(shopItemComponent);
            }
        }
        
        private itemSelected(item: PROJECT.ShopItemUI): void {
            this.selectedItem = item;
        }
    }
}
