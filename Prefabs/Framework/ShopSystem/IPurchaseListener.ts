/**
 * IPurchaseListener - Interface for objects that can handle purchases
 */
namespace PROJECT {
    export interface IPurchaseListener {
        handlePurchase(newPurchase: any): boolean;
    }
}
