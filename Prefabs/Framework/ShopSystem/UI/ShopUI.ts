namespace PROJECT {
    export class ShopUI extends TOOLKIT.ScriptComponent {
        private shopSystem: PROJECT.ShopSystem;
        private shopItemUIPrefab: PROJECT.ShopItemUI;
        private shopList: BABYLON.GUI.StackPanel;
        private creditComp: PROJECT.CreditComponent;
        private uiManager: PROJECT.UIManager;
        
        private creditText: BABYLON.GUI.TextBlock;
        
        private backBtn: BABYLON.GUI.Button;
        private buyBtn: BABYLON.GUI.Button;
        
        private shopItems: PROJECT.ShopItemUI[] = [];
        
        private selectedItem: PROJECT.ShopItemUI;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.ShopUI") {
            super(transform, scene, properties, alias);
        }
        
        protected start(): void {
            this.initShopItems();
            
            this.backBtn.onPointerClickObservable.add(() => {
                this.uiManager.swithToGameplayUI();
            });
            
            this.buyBtn.onPointerClickObservable.add(() => {
                this.tryPuchaseItem();
            });
            
            this.creditComp.onCreditChanged.push(this.updateCredit.bind(this));
            this.updateCredit(this.creditComp.credit);
        }
        
        private tryPuchaseItem(): void {
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
                TOOLKIT.SceneManager.DestroyTransformNode(itemToRemove.transform);
            }
        }
        
        private updateCredit(newCredit: number): void {
            this.creditText.text = newCredit.toString();
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
            const newItemUI = TOOLKIT.SceneManager.InstantiatePrefab(
                this.shopItemUIPrefab.transform,
                this.shopList.transform.position,
                BABYLON.Quaternion.Identity()
            ) as PROJECT.ShopItemUI;
            
            newItemUI.init(item, this.creditComp.credit);
            newItemUI.onItemSelected.push(this.itemSelected.bind(this));
            this.shopItems.push(newItemUI);
        }
        
        private itemSelected(item: PROJECT.ShopItemUI): void {
            this.selectedItem = item;
        }
    }
}
