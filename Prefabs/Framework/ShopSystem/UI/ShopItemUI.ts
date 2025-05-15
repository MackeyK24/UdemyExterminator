/**
 * ShopItemUI - UI component for displaying shop items and handling selection
 */
namespace PROJECT {
    export class ShopItemUI extends TOOLKIT.ScriptComponent {
        private icon: BABYLON.GUI.Image = null;
        private titleText: BABYLON.GUI.TextBlock = null;
        private priceText: BABYLON.GUI.TextBlock = null;
        private descriptionText: BABYLON.GUI.TextBlock = null;
        private button: BABYLON.GUI.Button = null;
        private grayOutCover: BABYLON.GUI.Image = null;
        
        private item: PROJECT.ShopItem = null;
        
        private inefficientCreditColor: BABYLON.Color3 = null;
        private sufficientCreditColor: BABYLON.Color3 = null;
        
        private onItemSelectedCallbacks: ((selectedItem: PROJECT.ShopItemUI) => void)[] = [];
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.ShopItemUI");
        }
        
        protected start(): void {
            if (this.button) {
                this.button.onPointerClickObservable.add(this.itemSelected.bind(this));
            }
        }
        
        private itemSelected(): void {
            if (this.onItemSelectedCallbacks.length > 0) {
                for (const callback of this.onItemSelectedCallbacks) {
                    callback(this);
                }
            }
        }
        
        public init(item: PROJECT.ShopItem, availableCredits: number): void {
            this.item = item;
            
            if (this.icon && item.itemIcon) {
                this.icon.source = item.itemIcon;
            }
            
            if (this.titleText) {
                this.titleText.text = item.title;
            }
            
            if (this.priceText) {
                this.priceText.text = "$" + item.price.toString();
            }
            
            if (this.descriptionText) {
                this.descriptionText.text = item.description;
            }
            
            this.refresh(availableCredits);
        }
        
        public getItem(): PROJECT.ShopItem {
            return this.item;
        }
        
        public refresh(availableCredits: number): void {
            if (availableCredits < this.item.price) {
                if (this.grayOutCover) {
                    this.grayOutCover.isVisible = true;
                }
                
                if (this.priceText) {
                    this.priceText.color = this.inefficientCreditColor;
                }
            } else {
                if (this.grayOutCover) {
                    this.grayOutCover.isVisible = false;
                }
                
                if (this.priceText) {
                    this.priceText.color = this.sufficientCreditColor;
                }
            }
        }
    }
}
