/**
 * ShopItem - Class representing an item in the shop system
 */
namespace PROJECT {
    export class ShopItem extends TOOLKIT.ScriptComponent {
        public title: string = "";
        public price: number = 0;
        public item: any = null;
        public itemIcon: string = "";
        public description: string = "";
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.ShopItem");
        }
    }
}
