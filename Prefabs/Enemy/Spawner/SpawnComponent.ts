namespace PROJECT {
    export class SpawnComponent extends TOOLKIT.ScriptComponent {
        private objectsToSpawn: BABYLON.TransformNode[] = [];
        private spawnTransform: BABYLON.TransformNode;
        private spawnAudio: BABYLON.Sound;
        private volume: number = 1.0;
        private animator: TOOLKIT.AnimationState;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.SpawnComponent") {
            super(transform, scene, properties, alias);
            
            if (properties.objectsToSpawn) this.objectsToSpawn = properties.objectsToSpawn;
            if (properties.spawnTransform) this.spawnTransform = properties.spawnTransform;
            if (properties.spawnAudio) this.spawnAudio = properties.spawnAudio;
            if (properties.volume) this.volume = properties.volume;
        }

        protected start(): void {
            this.animator = this.getComponent("TOOLKIT.AnimationState") as TOOLKIT.AnimationState;
        }

        public startSpawn(): boolean {
            if (this.objectsToSpawn.length === 0) return false;

            if (this.animator != null) {
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
            const newSpawn = TOOLKIT.SceneManager.InstantiatePrefab(
                this.objectsToSpawn[randomPick], 
                this.scene
            ) as BABYLON.TransformNode;
            
            newSpawn.position = this.spawnTransform.position.clone();
            newSpawn.rotationQuaternion = this.spawnTransform.rotationQuaternion.clone();
            
            const newSpawnInterface = TOOLKIT.SceneManager.FindScriptComponent(newSpawn, "PROJECT.ISpawnInterface") as PROJECT.ISpawnInterface;
            if (newSpawnInterface != null) {
                newSpawnInterface.spawnedBy(this.transform);
            }
        }
    }
}
