namespace PROJECT {
    export class ShopItem {
        public title: string;
        public price: number;
        public item: any;
        public itemIcon: BABYLON.Texture;
        public description: string;
        
        constructor(properties: any = {}) {
            if (properties.title) this.title = properties.title;
            if (properties.price) this.price = properties.price;
            if (properties.item) this.item = properties.item;
            if (properties.itemIcon) this.itemIcon = properties.itemIcon;
            if (properties.description) this.description = properties.description;
        }
    }
}
