namespace PROJECT {
    export class GameplayStatics extends TOOLKIT.ScriptComponent {
        private static audioPool: BABYLON.Sound[] = [];
        private static maxPoolSize: number = 10;
        private static currentPoolSize: number = 0;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.GameplayStatics") {
            super(transform, scene, properties, alias);
        }
        
        public static gameStarted(): void {
            GameplayStatics.audioPool = [];
            GameplayStatics.currentPoolSize = 0;
        }
        
        private static destroyAudioSrc(audioSrc: BABYLON.Sound): void {
            if (audioSrc) {
                audioSrc.dispose();
            }
        }
        
        private static createAudioSrc(scene: BABYLON.Scene): BABYLON.Sound {
            const audioSrc = new BABYLON.Sound("AudioSrc", "", scene, null, {
                volume: 1.0,
                spatialSound: true,
                distanceModel: "linear"
            });
            
            return audioSrc;
        }
        
        public static setGamePaused(paused: boolean): void {
            if (paused) {
                BABYLON.Engine.LastCreatedEngine.stopRenderLoop();
            } else {
                const scene = TOOLKIT.SceneManager.GetLastCreatedScene();
                BABYLON.Engine.LastCreatedEngine.runRenderLoop(() => {
                    scene.render();
                });
            }
        }
        
        public static playAudioAtLoc(audioToPlay: string, playLoc: BABYLON.Vector3, volume: number): void {
            let audioSrc: BABYLON.Sound = null;
            
            if (GameplayStatics.audioPool.length > 0) {
                audioSrc = GameplayStatics.audioPool.pop();
            } else if (GameplayStatics.currentPoolSize < GameplayStatics.maxPoolSize) {
                const scene = TOOLKIT.SceneManager.GetLastCreatedScene();
                audioSrc = GameplayStatics.createAudioSrc(scene);
                GameplayStatics.currentPoolSize++;
            } else {
                const scene = TOOLKIT.SceneManager.GetLastCreatedScene();
                audioSrc = GameplayStatics.createAudioSrc(scene);
            }
            
            if (audioSrc) {
                audioSrc.setPosition(playLoc);
                audioSrc.setVolume(volume);
                
                audioSrc.setUrl(audioToPlay);
                audioSrc.play();
                
                window.setTimeout(() => {
                    if (GameplayStatics.audioPool.length < GameplayStatics.maxPoolSize) {
                        GameplayStatics.audioPool.push(audioSrc);
                    } else {
                        GameplayStatics.destroyAudioSrc(audioSrc);
                        GameplayStatics.currentPoolSize--;
                    }
                }, audioSrc.length * 1000);
            }
        }
        
        public static playAudioAtPlayer(abilityAudio: string, volume: number): void {
            const camera = TOOLKIT.SceneManager.GetLastCreatedScene().activeCamera;
            if (camera) {
                GameplayStatics.playAudioAtLoc(abilityAudio, camera.position, volume);
            }
        }
    }
}
