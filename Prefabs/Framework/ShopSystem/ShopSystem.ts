namespace PROJECT {
    export class ShopSystem {
        private shopItems: PROJECT.ShopItem[] = [];
        
        constructor(properties: any = {}) {
            if (properties.shopItems) this.shopItems = properties.shopItems;
        }
        
        public getShopItems(): PROJECT.ShopItem[] {
            return this.shopItems;
        }
        
        public tryPurchase(selectedItem: PROJECT.ShopItem, purchaser: PROJECT.CreditComponent): boolean {
            return purchaser.purchase(selectedItem.price, selectedItem.item);
        }
    }
}
