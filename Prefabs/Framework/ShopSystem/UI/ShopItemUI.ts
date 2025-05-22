namespace PROJECT {
    export class ShopItemUI extends TOOLKIT.ScriptComponent {
        private icon: BABYLON.GUI.Image;
        private titleText: BABYLON.GUI.TextBlock;
        private priceText: BABYLON.GUI.TextBlock;
        private descriptionText: BABYLON.GUI.TextBlock;
        
        private button: BABYLON.GUI.Button;
        private grayOutCover: BABYLON.GUI.Image;
        
        private item: PROJECT.ShopItem;
        
        private inefficientCreditColor: BABYLON.Color4;
        private sufficientCreditColor: BABYLON.Color4;
        
        public onItemSelected: ((selectedItem: PROJECT.ShopItemUI) => void)[] = [];
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.ShopItemUI") {
            super(transform, scene, properties, alias);
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
        
        public init(item: PROJECT.ShopItem, availableCredits: number): void {
            this.item = item;
            
            this.icon.source = item.itemIcon;
            this.titleText.text = item.title;
            this.priceText.text = "$" + item.price.toString();
            this.descriptionText.text = item.description;
            
            this.refresh(availableCredits);
        }
        
        public getItem(): PROJECT.ShopItem {
            return this.item;
        }
        
        public refresh(availableCredits: number): void {
            if (availableCredits < this.item.price) {
                this.grayOutCover.isVisible = true;
                this.priceText.color = this.inefficientCreditColor.toHexString();
            } else {
                this.grayOutCover.isVisible = false;
                this.priceText.color = this.sufficientCreditColor.toHexString();
            }
        }
    }
}
