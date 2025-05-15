/**
 * HealthRegen - Ability that provides health regeneration over time
 */
namespace PROJECT {
    export class HealthRegen extends PROJECT.Ability {
        private healthRegenAmt: number = 10.0;
        private healthRegenDuration: number = 5.0;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.HealthRegen");
        }
        
        public activateAbility(): void {
            if (!this.commitAbility()) return;
            
            const healthComp = this.abilityComp.getComponent("PROJECT.HealthComponent") as PROJECT.HealthComponent;
            if (!healthComp) return;
            
            if (this.healthRegenDuration === 0) {
                healthComp.changeHealth(this.healthRegenAmt, this.abilityComp.transform);
                return;
            }
            
            this.startHealthRegen(this.healthRegenAmt, this.healthRegenDuration, healthComp);
        }
        
        private startHealthRegen(amt: number, duration: number, healthComp: PROJECT.HealthComponent): void {
            let counter = duration;
            const regenRate = amt / duration;
            
            const observer = this.scene.onBeforeRenderObservable.add(() => {
                counter -= this.getDeltaTime();
                
                if (counter <= 0) {
                    this.scene.onBeforeRenderObservable.remove(observer);
                    return;
                }
                
                healthComp.changeHealth(regenRate * this.getDeltaTime(), this.abilityComp.transform);
            });
        }
    }
}
