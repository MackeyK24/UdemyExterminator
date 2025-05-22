namespace PROJECT {
    export class PerceptionComponent extends TOOLKIT.ScriptComponent {
        private senses: PROJECT.SenseComp[] = [];
        private detectionAudio: string;
        private volume: number = 1.0;
        private currentlyPerceivedStimulis: PROJECT.PerceptionStimuli[] = [];
        
        private targetStimuli: PROJECT.PerceptionStimuli = null;
        
        public onPerceptionTargetChanged: ((target: BABYLON.TransformNode, sensed: boolean) => void)[] = [];
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.PerceptionComponent") {
            super(transform, scene, properties, alias);
        }
        
        protected awake(): void {
            const senseComponents = this.getComponents("PROJECT.SenseComp") as PROJECT.SenseComp[];
            if (senseComponents && senseComponents.length > 0) {
                this.senses = senseComponents;
                
                for (const sense of this.senses) {
                    sense.onPerceptionUpdated.push(this.senseUpdated.bind(this));
                }
            }
        }
        
        private senseUpdated(stimuli: PROJECT.PerceptionStimuli, successfullySensed: boolean): void {
            const index = this.currentlyPerceivedStimulis.indexOf(stimuli);
            
            if (successfullySensed) {
                if (index >= 0) {
                    this.currentlyPerceivedStimulis.splice(index, 1);
                }
                this.currentlyPerceivedStimulis.push(stimuli);
            } else if (index >= 0) {
                this.currentlyPerceivedStimulis.splice(index, 1);
            }
            
            if (this.currentlyPerceivedStimulis.length > 0) {
                const highestStimuli = this.currentlyPerceivedStimulis[this.currentlyPerceivedStimulis.length - 1];
                
                if (this.targetStimuli === null || this.targetStimuli !== highestStimuli) {
                    this.targetStimuli = highestStimuli;
                    
                    for (const callback of this.onPerceptionTargetChanged) {
                        callback(this.targetStimuli.transform, true);
                    }
                    
                    if (this.detectionAudio) {
                        const audioPos = this.transform.position.clone();
                        PROJECT.GameplayStatics.playAudioAtLoc(this.detectionAudio, audioPos, this.volume);
                    }
                }
            } else if (this.targetStimuli !== null) {
                for (const callback of this.onPerceptionTargetChanged) {
                    callback(this.targetStimuli.transform, false);
                }
                this.targetStimuli = null;
            }
        }
        
        public assignPercievedStimui(targetStimuli: PROJECT.PerceptionStimuli): void {
            if (this.senses.length > 0) {
                this.senses[0].assignPerceivedStimuli(targetStimuli);
            }
        }
    }
}
