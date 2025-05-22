namespace PROJECT {
    export class AlwaysAwareSense extends PROJECT.SenseComp {
        private awareDistance: number = 2.0;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.AlwaysAwareSense") {
            super(transform, scene, properties, alias);
        }
        
        protected override isStimuliSensable(stimuli: PROJECT.PerceptionStimuli): boolean {
            return BABYLON.Vector3.Distance(this.transform.position, stimuli.transform.position) <= this.awareDistance;
        }
        
        protected drawDebug(): void {
            super.drawDebug();
            
        }
    }
}
