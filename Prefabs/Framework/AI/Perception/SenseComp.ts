namespace PROJECT {
    export abstract class SenseComp extends TOOLKIT.ScriptComponent {
        private forgettingTime: number = 3.0;
        private static registeredStimulis: PROJECT.PerceptionStimuli[] = [];
        private perceivableStimulis: PROJECT.PerceptionStimuli[] = [];
        
        private forgettingRoutines: { [key: string]: number } = {};
        
        public onPerceptionUpdated: ((stimuli: PROJECT.PerceptionStimuli, successfullySensed: boolean) => void)[] = [];
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.SenseComp") {
            super(transform, scene, properties, alias);
            
            if (properties.forgettingTime) this.forgettingTime = properties.forgettingTime;
        }
        
        public static registerStimuli(stimuli: PROJECT.PerceptionStimuli): void {
            if (PROJECT.SenseComp.registeredStimulis.indexOf(stimuli) !== -1)
                return;
                
            PROJECT.SenseComp.registeredStimulis.push(stimuli);
        }
        
        public static unRegisterStimuli(stimuli: PROJECT.PerceptionStimuli): void {
            const index = PROJECT.SenseComp.registeredStimulis.indexOf(stimuli);
            if (index !== -1) {
                PROJECT.SenseComp.registeredStimulis.splice(index, 1);
            }
        }
        
        protected abstract isStimuliSensable(stimuli: PROJECT.PerceptionStimuli): boolean;
        
        protected update(): void {
            for (const stimuli of PROJECT.SenseComp.registeredStimulis) {
                if (this.isStimuliSensable(stimuli)) {
                    if (this.perceivableStimulis.indexOf(stimuli) === -1) {
                        this.perceivableStimulis.push(stimuli);
                        
                        const stimuliId = stimuli.transform.uniqueId.toString();
                        if (this.forgettingRoutines[stimuliId]) {
                            clearTimeout(this.forgettingRoutines[stimuliId]);
                            delete this.forgettingRoutines[stimuliId];
                        } else {
                            for (const callback of this.onPerceptionUpdated) {
                                callback(stimuli, true);
                            }
                        }
                    }
                } else {
                    const index = this.perceivableStimulis.indexOf(stimuli);
                    if (index !== -1) {
                        this.perceivableStimulis.splice(index, 1);
                        this.startForgetStimuli(stimuli);
                    }
                }
            }
        }
        
        public assignPerceivedStimuli(targetStimuli: PROJECT.PerceptionStimuli): void {
            this.perceivableStimulis.push(targetStimuli);
            
            for (const callback of this.onPerceptionUpdated) {
                callback(targetStimuli, true);
            }
            
            const stimuliId = targetStimuli.transform.uniqueId.toString();
            if (this.forgettingRoutines[stimuliId]) {
                clearTimeout(this.forgettingRoutines[stimuliId]);
                delete this.forgettingRoutines[stimuliId];
            }
        }
        
        private startForgetStimuli(stimuli: PROJECT.PerceptionStimuli): void {
            const stimuliId = stimuli.transform.uniqueId.toString();
            
            this.forgettingRoutines[stimuliId] = setTimeout(() => {
                delete this.forgettingRoutines[stimuliId];
                
                for (const callback of this.onPerceptionUpdated) {
                    callback(stimuli, false);
                }
            }, this.forgettingTime * 1000);
        }
        
        protected drawDebug(): void {
        }
    }
}
