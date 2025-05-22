namespace PROJECT {
    export class HitSense extends PROJECT.SenseComp {
        private healthComponent: PROJECT.HealthComponent;
        private hitMemory: number = 2.0;
        
        private hitRecord: { [key: string]: number } = {};
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.HitSense") {
            super(transform, scene, properties, alias);
        }
        
        protected override isStimuliSensable(stimuli: PROJECT.PerceptionStimuli): boolean {
            return stimuli.id in this.hitRecord;
        }
        
        protected start(): void {
            this.healthComponent = this.getComponent("PROJECT.HealthComponent") as PROJECT.HealthComponent;
            this.healthComponent.onTakeDamage.push(this.tookDamage.bind(this));
        }
        
        private tookDamage(health: number, delta: number, maxHealth: number, instigator: BABYLON.TransformNode): void {
            const stimuli = TOOLKIT.SceneManager.FindScriptComponent(instigator, "PROJECT.PerceptionStimuli") as PROJECT.PerceptionStimuli;
            
            if (stimuli) {
                if (stimuli.id in this.hitRecord) {
                    window.clearTimeout(this.hitRecord[stimuli.id]);
                }
                
                this.hitRecord[stimuli.id] = window.setTimeout(() => {
                    delete this.hitRecord[stimuli.id];
                }, this.hitMemory * 1000);
            }
        }
    }
}
