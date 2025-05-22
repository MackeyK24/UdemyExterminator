namespace PROJECT {
    export interface IPurchaseListener {
        handlePurchase(newPurchase: any): boolean;
    }
    
    export interface IRewardListener {
        reward(reward: PROJECT.Reward): void;
    }
    
    export class AbilityComponent extends TOOLKIT.ScriptComponent implements PROJECT.IPurchaseListener, PROJECT.IRewardListener {
        private initialAbilities: PROJECT.Ability[];
        
        private abilities: PROJECT.Ability[] = [];
        
        public onNewAbilityAdded: ((newAbility: PROJECT.Ability) => void)[] = [];
        public onStaminaChange: ((newAmount: number, maxAmount: number) => void)[] = [];
        
        private stamina: number = 200.0;
        private maxStamina: number = 200.0;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.AbilityComponent") {
            super(transform, scene, properties, alias);
        }
        
        public broadcastStaminaChangeImmedietely(): void {
            for (const callback of this.onStaminaChange) {
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
            const newAbility = TOOLKIT.SceneManager.InstantiatePrefabFromContainer(
                this.transform,
                ability.transform.name,
                ""
            ) as PROJECT.Ability;
            
            newAbility.initAbility(this);
            this.abilities.push(newAbility);
            
            for (const callback of this.onNewAbilityAdded) {
                callback(newAbility);
            }
        }
        
        public activateAbility(abilityToActivate: PROJECT.Ability): void {
            if (this.abilities.indexOf(abilityToActivate) >= 0) {
                abilityToActivate.activateAbility();
            }
        }
        
        private getStamina(): number {
            return this.stamina;
        }
        
        public tryConsumeStamina(staminaToConsume: number): boolean {
            if (this.stamina <= staminaToConsume) return false;
            
            this.stamina -= staminaToConsume;
            this.broadcastStaminaChangeImmedietely();
            return true;
        }
        
        public handlePurchase(newPurchase: any): boolean {
            const itemAsAbility = newPurchase as PROJECT.Ability;
            if (itemAsAbility == null) return false;
            
            this.giveAbility(itemAsAbility);
            
            return true;
        }
        
        public reward(reward: PROJECT.Reward): void {
            this.stamina = BABYLON.Scalar.Clamp(this.stamina + reward.staminaReward, 0, this.maxStamina);
            this.broadcastStaminaChangeImmedietely();
        }
    }
}
