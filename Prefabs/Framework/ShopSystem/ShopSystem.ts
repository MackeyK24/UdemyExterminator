/**
 * ShopSystem - System for managing shop items and purchases
 */
namespace PROJECT {
    export class ShopSystem extends TOOLKIT.ScriptComponent {
        private shopItems: PROJECT.ShopItem[] = [];
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.ShopSystem");
        }
        
        public getShopItems(): PROJECT.ShopItem[] {
            return this.shopItems;
        }
        
        public setShopItems(items: PROJECT.ShopItem[]): void {
            this.shopItems = items;
        }
        
        public tryPurchase(selectedItem: PROJECT.ShopItem, purchaser: PROJECT.CreditComponent): boolean {
            return purchaser.purchase(selectedItem.price, selectedItem.item);
        }
    }
}
