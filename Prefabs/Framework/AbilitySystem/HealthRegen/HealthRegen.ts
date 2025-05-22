namespace PROJECT {
    export class HealthRegen extends PROJECT.Ability {
        private healthRegenAmt: number;
        private healthRegenDuration: number;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.HealthRegen") {
            super(transform, scene, properties, alias);
            
            if (properties.healthRegenAmt) this.healthRegenAmt = properties.healthRegenAmt;
            if (properties.healthRegenDuration) this.healthRegenDuration = properties.healthRegenDuration;
        }

        public activateAbility(): void {
            if (!this.commitAbility()) return;

            const healthComp = this.abilityComp.getComponent("PROJECT.HealthComponent") as PROJECT.HealthComponent;
            if (healthComp != null) {
                if (this.healthRegenDuration === 0) {
                    healthComp.changeHealth(this.healthRegenAmt, this.abilityComp.transform);
                    return;
                }
                
                this.startHealthRegen(this.healthRegenAmt, this.healthRegenDuration, healthComp);
            }
        }

        private startHealthRegen(amt: number, duration: number, healthComp: PROJECT.HealthComponent): void {
            let counter = duration;
            const regenRate = amt / duration;
            
            const regenInterval = setInterval(() => {
                counter -= this.getDeltaTime();
                
                healthComp.changeHealth(regenRate * this.getDeltaTime(), this.abilityComp.transform);
                
                if (counter <= 0) {
                    clearInterval(regenInterval);
                }
            }, 16); // Approximately 60fps
        }
    }
}
