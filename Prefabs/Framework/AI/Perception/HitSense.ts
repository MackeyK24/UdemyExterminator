namespace PROJECT {
    export class HitSense extends PROJECT.SenseComp {
        private healthComponent: PROJECT.HealthComponent;
        private hitMemory: number = 2.0;
        
        private hitRecord: { [key: string]: number } = {};
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.HitSense") {
            super(transform, scene, properties, alias);
            
            if (properties.healthComponent) this.healthComponent = properties.healthComponent;
            if (properties.hitMemory) this.hitMemory = properties.hitMemory;
        }
        
        protected isStimuliSensable(stimuli: PROJECT.PerceptionStimuli): boolean {
            return this.hitRecord.hasOwnProperty(stimuli.transform.name);
        }
        
        protected start(): void {
            this.healthComponent.onTakeDamage.push(this.tookDamage.bind(this));
        }
        
        private tookDamage(health: number, delta: number, maxHealth: number, instigator: BABYLON.TransformNode): void {
            const stimuli = TOOLKIT.SceneManager.FindScriptComponent(instigator, "PROJECT.PerceptionStimuli") as PROJECT.PerceptionStimuli;
            
            if (stimuli != null) {
                if (this.hitRecord.hasOwnProperty(stimuli.transform.name)) {
                    clearTimeout(this.hitRecord[stimuli.transform.name]);
                }
                
                this.hitRecord[stimuli.transform.name] = setTimeout(() => {
                    delete this.hitRecord[stimuli.transform.name];
                }, this.hitMemory * 1000);
            }
        }
    }
}
