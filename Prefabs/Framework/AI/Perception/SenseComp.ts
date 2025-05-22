namespace PROJECT {
    export abstract class SenseComp extends TOOLKIT.ScriptComponent {
        private forgettingTime: number = 3.0;
        private static registeredStimulis: PROJECT.PerceptionStimuli[] = [];
        private perceivableStimulis: PROJECT.PerceptionStimuli[] = [];
        private forgettingRoutines: { [key: string]: number } = {};
        
        public onPerceptionUpdated: ((stimuli: PROJECT.PerceptionStimuli, successfullySensed: boolean) => void)[] = [];
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.SenseComp") {
            super(transform, scene, properties, alias);
        }
        
        public static registerStimuli(stimuli: PROJECT.PerceptionStimuli): void {
            if (PROJECT.SenseComp.registeredStimulis.indexOf(stimuli) >= 0) {
                return;
            }
            
            PROJECT.SenseComp.registeredStimulis.push(stimuli);
        }
        
        public static unRegisterStimuli(stimuli: PROJECT.PerceptionStimuli): void {
            const index = PROJECT.SenseComp.registeredStimulis.indexOf(stimuli);
            if (index >= 0) {
                PROJECT.SenseComp.registeredStimulis.splice(index, 1);
            }
        }
        
        protected abstract isStimuliSensable(stimuli: PROJECT.PerceptionStimuli): boolean;
        
        protected update(): void {
            for (const stimuli of PROJECT.SenseComp.registeredStimulis) {
                if (this.isStimuliSensable(stimuli)) {
                    if (this.perceivableStimulis.indexOf(stimuli) < 0) {
                        this.perceivableStimulis.push(stimuli);
                        
                        if (stimuli.id in this.forgettingRoutines) {
                            window.clearTimeout(this.forgettingRoutines[stimuli.id]);
                            delete this.forgettingRoutines[stimuli.id];
                        } else {
                            for (const callback of this.onPerceptionUpdated) {
                                callback(stimuli, true);
                            }
                        }
                    }
                } else {
                    const index = this.perceivableStimulis.indexOf(stimuli);
                    if (index >= 0) {
                        this.perceivableStimulis.splice(index, 1);
                        
                        this.forgettingRoutines[stimuli.id] = window.setTimeout(() => {
                            this.forgetStimuli(stimuli);
                        }, this.forgettingTime * 1000);
                    }
                }
            }
        }
        
        public assignPerceivedStimuli(targetStimuli: PROJECT.PerceptionStimuli): void {
            if (this.perceivableStimulis.indexOf(targetStimuli) < 0) {
                this.perceivableStimulis.push(targetStimuli);
                
                for (const callback of this.onPerceptionUpdated) {
                    callback(targetStimuli, true);
                }
            }
            
            if (targetStimuli.id in this.forgettingRoutines) {
                window.clearTimeout(this.forgettingRoutines[targetStimuli.id]);
                delete this.forgettingRoutines[targetStimuli.id];
            }
        }
        
        private forgetStimuli(stimuli: PROJECT.PerceptionStimuli): void {
            delete this.forgettingRoutines[stimuli.id];
            
            for (const callback of this.onPerceptionUpdated) {
                callback(stimuli, false);
            }
        }
        
        protected drawDebug(): void {
        }
    }
}
