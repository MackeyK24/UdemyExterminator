/**
 * SightSense - Perception component that detects stimuli within sight range and angle
 */
namespace PROJECT {
    export class SightSense extends PROJECT.SenseComp {
        private sightDistance: number = 5.0;
        private sightHalfAngle: number = 5.0;
        private eyeHeight: number = 1.0;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.SightSense");
        }
        
        protected isStimuliSensable(stimuli: PROJECT.PerceptionStimuli): boolean {
            const distance = BABYLON.Vector3.Distance(
                stimuli.transform.position, 
                this.transform.position
            );
            
            if (distance > this.sightDistance) {
                return false;
            }
            
            const forwardDir = this.transform.forward;
            const stimuliDir = BABYLON.Vector3.Normalize(
                stimuli.transform.position.subtract(this.transform.position)
            );
            
            const angle = BABYLON.Vector3.GetAngleBetweenVectors(
                forwardDir,
                stimuliDir,
                BABYLON.Vector3.Up()
            ) * (180 / Math.PI); // Convert to degrees
            
            if (angle > this.sightHalfAngle) {
                return false;
            }
            
            const eyePosition = this.transform.position.add(new BABYLON.Vector3(0, this.eyeHeight, 0));
            const ray = new BABYLON.Ray(eyePosition, stimuliDir, this.sightDistance);
            
            const hit = this.scene.pickWithRay(ray);
            
            if (hit.hit && hit.pickedMesh) {
                const hitTransform = hit.pickedMesh;
                const stimuliTransform = TOOLKIT.SceneManager.FindScriptComponent(
                    stimuli.transform,
                    "PROJECT.PerceptionStimuli"
                );
                
                if (hitTransform !== stimuliTransform) {
                    return false;
                }
            }
            
            return true;
        }
        
        protected drawDebug(): void {
            super.drawDebug();
        }
    }
}
