namespace PROJECT {
    export class SightSense extends PROJECT.SenseComp {
        private sightDistance: number = 5.0;
        private sightHalfAngle: number = 5.0;
        private eyeHeight: number = 1.0;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.SightSense") {
            super(transform, scene, properties, alias);
            
            if (properties.sightDistance) this.sightDistance = properties.sightDistance;
            if (properties.sightHalfAngle) this.sightHalfAngle = properties.sightHalfAngle;
            if (properties.eyeHeight) this.eyeHeight = properties.eyeHeight;
        }
        
        protected isStimuliSensable(stimuli: PROJECT.PerceptionStimuli): boolean {
            const distance = BABYLON.Vector3.Distance(stimuli.transform.position, this.transform.position);
            if (distance > this.sightDistance)
                return false;
                
            const forwardDir = this.transform.forward;
            const stimuliDir = BABYLON.Vector3.Normalize(
                stimuli.transform.position.subtract(this.transform.position)
            );
            
            if (BABYLON.Vector3.GetAngleBetweenVectors(forwardDir, stimuliDir, BABYLON.Vector3.Up()) > this.sightHalfAngle)
                return false;
                
            const raycastOrigin = this.transform.position.add(BABYLON.Vector3.Up().scale(this.eyeHeight));
            const ray = new BABYLON.Ray(raycastOrigin, stimuliDir, this.sightDistance);
            const hit = this.scene.pickWithRay(ray);
            
            if (hit && hit.pickedMesh && hit.pickedMesh !== stimuli.transform) {
                return false;
            }
            
            return true;
        }
        
        protected drawDebug(): void {
            super.drawDebug();
            
            
        }
    }
}
