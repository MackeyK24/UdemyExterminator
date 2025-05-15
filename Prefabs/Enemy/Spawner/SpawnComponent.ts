/**
 * SpawnComponent - Component for spawning game objects with animation and audio support
 */
namespace PROJECT {
    export class SpawnComponent extends TOOLKIT.ScriptComponent {
        private objectsToSpawn: BABYLON.TransformNode[] = [];
        private spawnTransform: BABYLON.TransformNode = null;
        private spawnAudio: BABYLON.Sound = null;
        private volume: number = 1.0;
        private animator: TOOLKIT.AnimationState = null;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.SpawnComponent");
        }
        
        protected start(): void {
            this.animator = new TOOLKIT.AnimationState(this.transform, this.scene);
        }
        
        public startSpawn(): boolean {
            if (this.objectsToSpawn.length === 0) return false;
            
            if (this.animator) {
                this.animator.setTrigger("Spawn");
            } else {
                this.spawnImpl();
            }
            
            const spawnAudioLoc = this.transform.position.clone();
            PROJECT.GameplayStatics.playAudioAtLoc(this.spawnAudio, spawnAudioLoc, this.volume);
            
            return true;
        }
        
        public spawnImpl(): void {
            const randomPick = Math.floor(Math.random() * this.objectsToSpawn.length);
            
            const newSpawn = TOOLKIT.SceneManager.InstantiatePrefabFromContainer(
                this.spawnTransform, 
                this.objectsToSpawn[randomPick].name, 
                "SpawnedObject"
            );
            
            const newSpawnInterface = newSpawn.getComponent("PROJECT.ISpawnInterface") as PROJECT.ISpawnInterface;
            if (newSpawnInterface) {
                newSpawnInterface.spawnedBy(this.transform);
            }
        }
    }
}
