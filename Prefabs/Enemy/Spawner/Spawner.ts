/**
 * VFXSpec and Spawner - Classes for handling enemy spawning and death effects
 */
namespace PROJECT {
    export class VFXSpec {
        public particleSystem: BABYLON.ParticleSystem = null;
        public size: number = 1.0;
    }
    
    export class Spawner extends PROJECT.Enemy {
        private deathVFX: PROJECT.VFXSpec[] = [];
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.Spawner");
        }
        
        protected override dead(): void {
            for (const spec of this.deathVFX) {
                if (spec.particleSystem) {
                    const particleSys = BABYLON.ParticleSystem.Clone(spec.particleSystem, "DeathParticle");
                    particleSys.emitter = new BABYLON.Vector3(
                        this.transform.position.x,
                        this.transform.position.y,
                        this.transform.position.z
                    );
                    particleSys.minScaleX = spec.size;
                    particleSys.minScaleY = spec.size;
                    particleSys.minScaleZ = spec.size;
                    particleSys.maxScaleX = spec.size;
                    particleSys.maxScaleY = spec.size;
                    particleSys.maxScaleZ = spec.size;
                    particleSys.start();
                }
            }
        }
    }
}
