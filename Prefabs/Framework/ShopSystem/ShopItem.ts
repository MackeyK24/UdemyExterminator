namespace PROJECT {
    export class ShopItem extends TOOLKIT.ScriptComponent {
        public title: string;
        public price: number;
        public item: any;
        public itemIcon: string;
        public description: string;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.ShopItem") {
            super(transform, scene, properties, alias);
        }
    }
}
