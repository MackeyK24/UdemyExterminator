/**
 * PerceptionComponent - Manages AI perception through multiple sense components
 */
namespace PROJECT {
    export class PerceptionComponent extends TOOLKIT.ScriptComponent {
        private senses: PROJECT.SenseComp[] = [];
        private detectionAudio: BABYLON.Sound = null;
        private volume: number = 1.0;
        private currentlyPerceivedStimulis: PROJECT.PerceptionStimuli[] = [];
        private targetStimuli: PROJECT.PerceptionStimuli = null;
        
        private onPerceptionTargetChangedCallbacks: ((target: BABYLON.TransformNode, sensed: boolean) => void)[] = [];
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.PerceptionComponent");
        }
        
        protected awake(): void {
            if (this.senses && this.senses.length > 0) {
                for (const sense of this.senses) {
                    sense.registerOnPerceptionUpdated(this.senseUpdated.bind(this));
                }
            }
        }
        
        private senseUpdated(stimuli: PROJECT.PerceptionStimuli, successfullySensed: boolean): void {
            const stimuliIndex = this.currentlyPerceivedStimulis.indexOf(stimuli);
            
            if (successfullySensed) {
                if (stimuliIndex >= 0) {
                    this.currentlyPerceivedStimulis.splice(stimuliIndex, 1);
                    this.currentlyPerceivedStimulis.push(stimuli);
                } else {
                    this.currentlyPerceivedStimulis.push(stimuli);
                }
            } else if (stimuliIndex >= 0) {
                this.currentlyPerceivedStimulis.splice(stimuliIndex, 1);
            }
            
            if (this.currentlyPerceivedStimulis.length > 0) {
                const highestStimuli = this.currentlyPerceivedStimulis[this.currentlyPerceivedStimulis.length - 1];
                
                if (this.targetStimuli === null || this.targetStimuli !== highestStimuli) {
                    this.targetStimuli = highestStimuli;
                    
                    for (const callback of this.onPerceptionTargetChangedCallbacks) {
                        callback(this.targetStimuli.transform, true);
                    }
                    
                    if (this.detectionAudio) {
                        const audioPos = this.transform.position.clone();
                        PROJECT.GameplayStatics.playAudioAtLoc(this.detectionAudio, audioPos, this.volume);
                    }
                }
            } else if (this.targetStimuli !== null) {
                for (const callback of this.onPerceptionTargetChangedCallbacks) {
                    callback(this.targetStimuli.transform, false);
                }
                
                this.targetStimuli = null;
            }
        }
        
        public assignPerceivedStimuli(targetStimuli: PROJECT.PerceptionStimuli): void {
            if (this.senses && this.senses.length > 0) {
                this.senses[0].assignPerceivedStimuli(targetStimuli);
            }
        }
        
        public registerOnPerceptionTargetChanged(callback: (target: BABYLON.TransformNode, sensed: boolean) => void): void {
            this.onPerceptionTargetChangedCallbacks.push(callback);
        }
    }
}
