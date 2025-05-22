namespace PROJECT {
    export class ShopSystem extends TOOLKIT.ScriptComponent {
        private shopItems: PROJECT.ShopItem[];
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.ShopSystem") {
            super(transform, scene, properties, alias);
        }
        
        public getShopItems(): PROJECT.ShopItem[] {
            return this.shopItems;
        }
        
        public tryPurchase(selectedItem: PROJECT.ShopItem, purchaser: PROJECT.CreditComponent): boolean {
            return purchaser.purchase(selectedItem.price, selectedItem.item);
        }
    }
}
