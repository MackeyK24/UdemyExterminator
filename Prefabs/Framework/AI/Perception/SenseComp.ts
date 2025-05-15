/**
 * SenseComp - Abstract base class for all sense components in the perception system
 */
namespace PROJECT {
    export abstract class SenseComp extends TOOLKIT.ScriptComponent {
        private forgettingTime: number = 3.0;
        private static registeredStimulis: PROJECT.PerceptionStimuli[] = [];
        private perceivableStimulis: PROJECT.PerceptionStimuli[] = [];
        
        private forgettingTimeouts: Map<PROJECT.PerceptionStimuli, number> = new Map<PROJECT.PerceptionStimuli, number>();
        
        private onPerceptionUpdatedCallbacks: ((stimuli: PROJECT.PerceptionStimuli, successfullySensed: boolean) => void)[] = [];
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.SenseComp");
        }
        
        public static registerStimuli(stimuli: PROJECT.PerceptionStimuli): void {
            if (PROJECT.SenseComp.registeredStimulis.includes(stimuli)) {
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
                    if (!this.perceivableStimulis.includes(stimuli)) {
                        this.perceivableStimulis.push(stimuli);
                        
                        if (this.forgettingTimeouts.has(stimuli)) {
                            clearTimeout(this.forgettingTimeouts.get(stimuli));
                            this.forgettingTimeouts.delete(stimuli);
                        } else {
                            for (const callback of this.onPerceptionUpdatedCallbacks) {
                                callback(stimuli, true);
                            }
                        }
                    }
                } else {
                    const index = this.perceivableStimulis.indexOf(stimuli);
                    if (index >= 0) {
                        this.perceivableStimulis.splice(index, 1);
                        
                        const timeoutId = setTimeout(() => {
                            this.forgettingTimeouts.delete(stimuli);
                            
                            for (const callback of this.onPerceptionUpdatedCallbacks) {
                                callback(stimuli, false);
                            }
                        }, this.forgettingTime * 1000);
                        
                        this.forgettingTimeouts.set(stimuli, timeoutId);
                    }
                }
            }
        }
        
        public assignPerceivedStimuli(targetStimuli: PROJECT.PerceptionStimuli): void {
            if (!this.perceivableStimulis.includes(targetStimuli)) {
                this.perceivableStimulis.push(targetStimuli);
                
                for (const callback of this.onPerceptionUpdatedCallbacks) {
                    callback(targetStimuli, true);
                }
                
                if (this.forgettingTimeouts.has(targetStimuli)) {
                    clearTimeout(this.forgettingTimeouts.get(targetStimuli));
                    this.forgettingTimeouts.delete(targetStimuli);
                }
            }
        }
        
        protected drawDebug(): void {
        }
        
        protected onDestroy(): void {
            this.forgettingTimeouts.forEach((timeoutId) => {
                clearTimeout(timeoutId);
            });
            this.forgettingTimeouts.clear();
        }
        
        public registerOnPerceptionUpdated(callback: (stimuli: PROJECT.PerceptionStimuli, successfullySensed: boolean) => void): void {
            this.onPerceptionUpdatedCallbacks.push(callback);
        }
    }
}
