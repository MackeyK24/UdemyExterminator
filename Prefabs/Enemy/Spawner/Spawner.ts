namespace PROJECT {
    export interface VFXSpec {
        particleSystem?: BABYLON.ParticleSystem;
        size?: number;
    }

    export class Spawner extends PROJECT.Enemy {
        private deathVFX: PROJECT.VFXSpec[] = [];

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.Spawner") {
            super(transform, scene, properties, alias);
            
            if (properties.deathVFX) this.deathVFX = properties.deathVFX;
        }

        protected dead(): void {
            for (let i = 0; i < this.deathVFX.length; i++) {
                const spec = this.deathVFX[i];
                if (spec.particleSystem) {
                    const particleSys = TOOLKIT.SceneManager.InstantiatePrefab(spec.particleSystem, this.scene) as BABYLON.ParticleSystem;
                    particleSys.emitter = new BABYLON.Vector3(this.transform.position.x, this.transform.position.y, this.transform.position.z);
                    
                    const size = spec.size || 1.0;
                    particleSys.minSize = size;
                    particleSys.maxSize = size;
                    
                    particleSys.start();
                }
            }
        }
    }
}
