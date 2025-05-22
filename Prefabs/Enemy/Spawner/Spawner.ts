namespace PROJECT {
    export class VFXSpec extends TOOLKIT.ScriptComponent {
        public particleSystem: BABYLON.ParticleSystem;
        public size: number;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.VFXSpec") {
            super(transform, scene, properties, alias);
        }
    }
    
    export class Spawner extends PROJECT.Enemy {
        private deathVFX: PROJECT.VFXSpec[];
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.Spawner") {
            super(transform, scene, properties, alias);
        }
        
        protected override dead(): void {
            for (const spec of this.deathVFX) {
                const particleSys = TOOLKIT.SceneManager.InstantiatePrefab(spec.particleSystem, this.transform.position, BABYLON.Quaternion.Identity());
                particleSys.scaling = new BABYLON.Vector3(spec.size, spec.size, spec.size);
            }
        }
    }
}
