namespace PROJECT {
    export class AbilityComponent extends TOOLKIT.ScriptComponent implements PROJECT.IPurchaseListener, PROJECT.IRewardListener {
        private initialAbilities: PROJECT.Ability[] = [];
        private abilities: PROJECT.Ability[] = [];
        
        public onNewAbilityAdded: ((newAbility: PROJECT.Ability) => void)[] = [];
        public onStaminaChange: ((newAmount: number, maxAmount: number) => void)[] = [];
        
        private stamina: number = 200.0;
        private maxStamina: number = 200.0;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.AbilityComponent") {
            super(transform, scene, properties, alias);
            
            if (properties.initialAbilities) this.initialAbilities = properties.initialAbilities;
            if (properties.stamina) this.stamina = properties.stamina;
            if (properties.maxStamina) this.maxStamina = properties.maxStamina;
        }

        public broadcastStaminaChangeImmedietely(): void {
            if (this.onStaminaChange.length > 0) {
                for (let i = 0; i < this.onStaminaChange.length; i++) {
                    this.onStaminaChange[i](this.stamina, this.maxStamina);
                }
            }
        }

        protected start(): void {
            for (let i = 0; i < this.initialAbilities.length; i++) {
                this.giveAbility(this.initialAbilities[i]);
            }
        }

        private giveAbility(ability: PROJECT.Ability): void {
            const newAbility = TOOLKIT.SceneManager.InstantiatePrefab(
                ability, 
                this.scene
            ) as PROJECT.Ability;
            
            newAbility.initAbility(this);
            this.abilities.push(newAbility);
            
            if (this.onNewAbilityAdded.length > 0) {
                for (let i = 0; i < this.onNewAbilityAdded.length; i++) {
                    this.onNewAbilityAdded[i](newAbility);
                }
            }
        }

        public activateAbility(abilityToActivate: PROJECT.Ability): void {
            if (this.abilities.indexOf(abilityToActivate) !== -1) {
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
            this.stamina = Math.min(Math.max(this.stamina + reward.staminaReward, 0), this.maxStamina);
            this.broadcastStaminaChangeImmedietely();
        }
    }
}
