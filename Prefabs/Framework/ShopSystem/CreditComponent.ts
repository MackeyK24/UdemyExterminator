/**
 * CreditComponent - Component that manages credits for purchases and rewards
 */
namespace PROJECT {
    export class CreditComponent extends TOOLKIT.ScriptComponent implements PROJECT.IRewardListener {
        private credits: number = 0;
        private purchaseListeners: BABYLON.TransformNode[] = [];
        private purchaseListenerInterfaces: PROJECT.IPurchaseListener[] = [];
        private onCreditChangedCallbacks: ((newCredit: number) => void)[] = [];
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.CreditComponent");
        }
        
        protected start(): void {
            this.collectPurchaseListeners();
        }
        
        private collectPurchaseListeners(): void {
            for (const listener of this.purchaseListeners) {
                const listenerInterface = listener.getComponent("PROJECT.IPurchaseListener") as PROJECT.IPurchaseListener;
                if (listenerInterface) {
                    this.purchaseListenerInterfaces.push(listenerInterface);
                }
            }
        }
        
        private broadcastPurchase(item: any): void {
            for (const purchaseListener of this.purchaseListenerInterfaces) {
                if (purchaseListener.handlePurchase(item)) {
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
            
            for (const callback of this.onCreditChangedCallbacks) {
                callback(this.credits);
            }
            
            this.broadcastPurchase(item);
            
            return true;
        }
        
        public reward(reward: PROJECT.Reward): void {
            this.credits += reward.creditReward;
            
            for (const callback of this.onCreditChangedCallbacks) {
                callback(this.credits);
            }
        }
    }
}
