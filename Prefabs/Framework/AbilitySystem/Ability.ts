/**
 * Ability - Abstract base class for player abilities with cooldown and stamina management
 */
namespace PROJECT {
    export abstract class Ability {
        private abilityIcon: BABYLON.GUI.Image = null;
        private staminaCost: number = 10.0;
        private cooldownDuration: number = 2.0;
        
        private abilityAudio: BABYLON.Sound = null;
        private volume: number = 1.0;
        
        private abilityComponent: PROJECT.AbilityComponent = null;
        private abilityOnCooldown: boolean = false;
        
        private onCooldownStartedCallbacks: (() => void)[] = [];
        
        public get abilityComp(): PROJECT.AbilityComponent {
            return this.abilityComponent;
        }
        
        private set abilityComp(value: PROJECT.AbilityComponent) {
            this.abilityComponent = value;
        }
        
        public getAbilityIcon(): BABYLON.GUI.Image {
            return this.abilityIcon;
        }
        
        public initAbility(abilityComponent: PROJECT.AbilityComponent): void {
            this.abilityComponent = abilityComponent;
        }
        
        public abstract activateAbility(): void;
        
        protected commitAbility(): boolean {
            if (this.abilityOnCooldown) return false;
            
            if (this.abilityComponent === null || !this.abilityComponent.tryConsumeStamina(this.staminaCost)) {
                return false;
            }
            
            this.startAbilityCooldown();
            PROJECT.GameplayStatics.playAudioAtPlayer(this.abilityAudio, this.volume);
            
            return true;
        }
        
        public getCooldownDuration(): number {
            return this.cooldownDuration;
        }
        
        private startAbilityCooldown(): void {
            this.startCooldownAsync();
        }
        
        private async startCooldownAsync(): Promise<void> {
            this.abilityOnCooldown = true;
            
            for (const callback of this.onCooldownStartedCallbacks) {
                callback();
            }
            
            await new Promise(resolve => setTimeout(resolve, this.cooldownDuration * 1000));
            
            this.abilityOnCooldown = false;
        }
        
        public registerOnCooldownStarted(callback: () => void): void {
            this.onCooldownStartedCallbacks.push(callback);
        }
    }
}
