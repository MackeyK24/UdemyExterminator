namespace PROJECT {
    export abstract class Ability extends TOOLKIT.ScriptComponent {
        private abilityIcon: BABYLON.Texture;
        private staminaCost: number = 10.0;
        private cooldownDuration: number = 2.0;
        
        private abilityAudio: string;
        private volume: number = 1.0;
        
        private abilityComponent: PROJECT.AbilityComponent;
        
        private abilityOnCooldown: boolean = false;
        
        public onCooldownStarted: (() => void)[] = [];
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.Ability") {
            super(transform, scene, properties, alias);
        }
        
        public getAbilityIcon(): BABYLON.Texture {
            return this.abilityIcon;
        }
        
        public initAbility(abilityComponent: PROJECT.AbilityComponent): void {
            this.abilityComponent = abilityComponent;
        }
        
        public abstract activateAbility(): void;
        
        protected commitAbility(): boolean {
            if (this.abilityOnCooldown) return false;
            
            if (this.abilityComponent == null || !this.abilityComponent.tryConsumeStamina(this.staminaCost)) {
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
            this.cooldownCoroutine();
        }
        
        private cooldownCoroutine(): void {
            this.abilityOnCooldown = true;
            
            for (const callback of this.onCooldownStarted) {
                callback();
            }
            
            window.setTimeout(() => {
                this.abilityOnCooldown = false;
            }, this.cooldownDuration * 1000);
        }
    }
}
