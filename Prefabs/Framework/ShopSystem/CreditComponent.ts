namespace PROJECT {
    export interface IPurchaseListener {
        handlePurchase?: (newPurchase: any) => boolean;
    }
    
    export class CreditComponent extends TOOLKIT.ScriptComponent implements PROJECT.IRewardListener {
        private credits: number;
        private purchaseListeners: BABYLON.TransformNode[] = [];
        
        private purchaseListenerInterfaces: PROJECT.IPurchaseListener[] = [];
        
        public onCreditChanged: ((newCredit: number) => void)[] = [];
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.CreditComponent") {
            super(transform, scene, properties, alias);
            
            if (properties.credits) this.credits = properties.credits;
            if (properties.purchaseListeners) this.purchaseListeners = properties.purchaseListeners;
        }
        
        protected start(): void {
            this.collectPurchaseListeners();
        }
        
        private collectPurchaseListeners(): void {
            for (const listener of this.purchaseListeners) {
                const listenerInterface = TOOLKIT.SceneManager.FindScriptComponent(
                    listener, 
                    "PROJECT.IPurchaseListener"
                ) as PROJECT.IPurchaseListener;
                
                if (listenerInterface != null) {
                    this.purchaseListenerInterfaces.push(listenerInterface);
                }
            }
        }
        
        private broadcastPurchase(item: any): void {
            for (const purchaseListener of this.purchaseListenerInterfaces) {
                if (purchaseListener.handlePurchase && purchaseListener.handlePurchase(item)) {
                    return;
                }
            }
        }
        
        public get credit(): number {
            return this.credits;
        }
        
        public purchase(price: number, item: any): boolean {
            if (this.credits < price) return false;
            
            this.credits -= price;
            
            for (const callback of this.onCreditChanged) {
                callback(this.credits);
            }
            
            this.broadcastPurchase(item);
            
            return true;
        }
        
        public reward(reward: PROJECT.Reward): void {
            this.credits += reward.creditReward;
            
            for (const callback of this.onCreditChanged) {
                callback(this.credits);
            }
        }
    }
}
