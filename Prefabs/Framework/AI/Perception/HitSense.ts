/**
 * HitSense - Perception component that tracks damage sources
 */
namespace PROJECT {
    export class HitSense extends PROJECT.SenseComp {
        private healthComponent: PROJECT.HealthComponent = null;
        private hitMemory: number = 2.0;
        
        private hitRecord: Map<PROJECT.PerceptionStimuli, number> = new Map<PROJECT.PerceptionStimuli, number>();
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.HitSense");
        }
        
        protected isStimuliSensable(stimuli: PROJECT.PerceptionStimuli): boolean {
            return this.hitRecord.has(stimuli);
        }
        
        protected start(): void {
            if (this.healthComponent) {
                this.healthComponent.registerOnTakeDamage(this.tookDamage.bind(this));
            }
        }
        
        private tookDamage(health: number, delta: number, maxHealth: number, instigator: BABYLON.TransformNode): void {
            const stimuli = TOOLKIT.SceneManager.FindScriptComponent(
                instigator, 
                "PROJECT.PerceptionStimuli"
            ) as PROJECT.PerceptionStimuli;
            
            if (stimuli) {
                const newForgettingTimeout = setTimeout(() => {
                    this.hitRecord.delete(stimuli);
                }, this.hitMemory * 1000);
                
                if (this.hitRecord.has(stimuli)) {
                    clearTimeout(this.hitRecord.get(stimuli));
                    this.hitRecord.set(stimuli, newForgettingTimeout);
                } else {
                    this.hitRecord.set(stimuli, newForgettingTimeout);
                }
            }
        }
        
        protected onDestroy(): void {
            this.hitRecord.forEach((timeoutId) => {
                clearTimeout(timeoutId);
            });
            this.hitRecord.clear();
        }
    }
}
