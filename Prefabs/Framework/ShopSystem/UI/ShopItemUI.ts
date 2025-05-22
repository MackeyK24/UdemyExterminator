namespace PROJECT {
    export class ShopItemUI extends TOOLKIT.ScriptComponent {
        private icon: BABYLON.GUI.Image;
        private titleText: BABYLON.GUI.TextBlock;
        private priceText: BABYLON.GUI.TextBlock;
        private descriptionText: BABYLON.GUI.TextBlock;
        
        private button: BABYLON.GUI.Button;
        private grayOutCover: BABYLON.GUI.Image;
        
        private item: PROJECT.ShopItem;
        
        private inEfficientCreditColor: BABYLON.Color4;
        private surffiicentCreditColor: BABYLON.Color4;
        
        public onItemSelected: ((selectedItem: PROJECT.ShopItemUI) => void)[] = [];
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.ShopItemUI") {
            super(transform, scene, properties, alias);
            
            if (properties.icon) this.icon = properties.icon;
            if (properties.titleText) this.titleText = properties.titleText;
            if (properties.priceText) this.priceText = properties.priceText;
            if (properties.descriptionText) this.descriptionText = properties.descriptionText;
            if (properties.button) this.button = properties.button;
            if (properties.grayOutCover) this.grayOutCover = properties.grayOutCover;
            if (properties.inEfficientCreditColor) this.inEfficientCreditColor = properties.inEfficientCreditColor;
            if (properties.surffiicentCreditColor) this.surffiicentCreditColor = properties.surffiicentCreditColor;
        }
        
        protected start(): void {
            this.button.onPointerClickObservable.add(() => {
                this.itemSelected();
            });
        }
        
        private itemSelected(): void {
            for (const callback of this.onItemSelected) {
                callback(this);
            }
        }
        
        public init(item: PROJECT.ShopItem, avaliableCredits: number): void {
            this.item = item;
            
            this.icon.source = item.itemIcon;
            this.titleText.text = item.title;
            this.priceText.text = "$" + item.price.toString();
            this.descriptionText.text = item.description;
            
            this.refresh(avaliableCredits);
        }
        
        public getItem(): PROJECT.ShopItem {
            return this.item;
        }
        
        public refresh(avaliableCredits: number): void {
            if (avaliableCredits < this.item.price) {
                this.grayOutCover.isVisible = true;
                this.priceText.color = this.inEfficientCreditColor;
            } else {
                this.grayOutCover.isVisible = false;
                this.priceText.color = this.surffiicentCreditColor;
            }
        }
    }
}
