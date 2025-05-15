/**
 * AbilityComponent - Manages abilities and stamina resources
 */
namespace PROJECT {
    export class AbilityComponent extends TOOLKIT.ScriptComponent implements PROJECT.IPurchaseListener, PROJECT.IRewardListener {
        private initialAbilities: PROJECT.Ability[] = [];
        private abilities: PROJECT.Ability[] = [];
        
        private stamina: number = 200.0;
        private maxStamina: number = 200.0;
        
        private onNewAbilityAddedCallbacks: ((newAbility: PROJECT.Ability) => void)[] = [];
        private onStaminaChangeCallbacks: ((newAmount: number, maxAmount: number) => void)[] = [];
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.AbilityComponent");
        }
        
        public broadcastStaminaChangeImmedietely(): void {
            for (const callback of this.onStaminaChangeCallbacks) {
                callback(this.stamina, this.maxStamina);
            }
        }
        
        protected start(): void {
            if (this.initialAbilities) {
                for (const ability of this.initialAbilities) {
                    this.giveAbility(ability);
                }
            }
        }
        
        private giveAbility(ability: PROJECT.Ability): void {
            const newAbility = Object.create(ability);
            
            newAbility.initAbility(this);
            
            this.abilities.push(newAbility);
            
            for (const callback of this.onNewAbilityAddedCallbacks) {
                callback(newAbility);
            }
        }
        
        public activateAbility(abilityToActivate: PROJECT.Ability): void {
            if (this.abilities.includes(abilityToActivate)) {
                abilityToActivate.activateAbility();
            }
        }
        
        public getStamina(): number {
            return this.stamina;
        }
        
        public tryConsumeStamina(staminaToConsume: number): boolean {
            if (this.stamina <= staminaToConsume) return false;
            
            this.stamina -= staminaToConsume;
            this.broadcastStaminaChangeImmedietely();
            return true;
        }
        
        public handlePurchase(newPurchase: any): boolean {
            if (newPurchase instanceof PROJECT.Ability) {
                this.giveAbility(newPurchase);
                return true;
            }
            
            return false;
        }
        
        public reward(reward: PROJECT.Reward): void {
            this.stamina = Math.max(0, Math.min(this.stamina + reward.staminaReward, this.maxStamina));
            this.broadcastStaminaChangeImmedietely();
        }
        
        public registerOnNewAbilityAdded(callback: (newAbility: PROJECT.Ability) => void): void {
            this.onNewAbilityAddedCallbacks.push(callback);
        }
        
        public registerOnStaminaChange(callback: (newAmount: number, maxAmount: number) => void): void {
            this.onStaminaChangeCallbacks.push(callback);
        }
    }
}
