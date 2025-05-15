/**
 * AlwaysAwareSense - Perception component that detects stimuli within a specified distance
 */
namespace PROJECT {
    export class AlwaysAwareSense extends PROJECT.SenseComp {
        private awareDistance: number = 2.0;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.AlwaysAwareSense");
        }
        
        protected isStimuliSensable(stimuli: PROJECT.PerceptionStimuli): boolean {
            return BABYLON.Vector3.Distance(
                this.transform.position, 
                stimuli.transform.position
            ) <= this.awareDistance;
        }
        
        protected drawDebug(): void {
            super.drawDebug();
        }
    }
}
