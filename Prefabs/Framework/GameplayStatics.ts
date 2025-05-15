/**
 * GameplayStatics - Static utility class for common gameplay functions
 */
namespace PROJECT {
    export class GameplayStatics {
        private static audioPool: BABYLON.Sound[] = [];
        private static audioPoolSize: number = 10;
        private static audioPoolIndex: number = 0;
        
        public static gameStarted(): void {
            GameplayStatics.audioPool = [];
            
            for (let i = 0; i < GameplayStatics.audioPoolSize; i++) {
                GameplayStatics.audioPool.push(null);
            }
        }
        
        public static setGamePaused(paused: boolean): void {
            if (paused) {
            } else {
            }
        }
        
        public static playAudioAtLoc(audioToPlay: BABYLON.Sound, playLoc: BABYLON.Vector3, volume: number): void {
            if (!audioToPlay) return;
            
            const newSound = audioToPlay.clone();
            newSound.setPosition(playLoc);
            newSound.setVolume(volume);
            
            GameplayStatics.audioPool[GameplayStatics.audioPoolIndex] = newSound;
            GameplayStatics.audioPoolIndex = (GameplayStatics.audioPoolIndex + 1) % GameplayStatics.audioPoolSize;
            
            newSound.play();
            
            newSound.onEndedObservable.addOnce(() => {
                newSound.dispose();
            });
        }
        
        public static playAudioAtPlayer(audioToPlay: BABYLON.Sound, volume: number): void {
            const scene = audioToPlay.getScene();
            if (!scene || !scene.activeCamera) return;
            
            const cameraPosition = scene.activeCamera.position.clone();
            GameplayStatics.playAudioAtLoc(audioToPlay, cameraPosition, volume);
        }
    }
}
