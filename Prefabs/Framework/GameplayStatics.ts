namespace PROJECT {
    export class GameplayStatics {
        private static audioPool: BABYLON.Sound[] = [];
        private static maxPoolSize: number = 10;
        private static initialPoolSize: number = 5;

        public static gameStarted(): void {
            this.audioPool = [];
            for (let i = 0; i < this.initialPoolSize; i++) {
                const audioSrc = this.createAudioSrc();
                this.audioPool.push(audioSrc);
            }
        }

        private static createAudioSrc(): BABYLON.Sound {
            const audioSrc = new BABYLON.Sound("PooledSound", null, TOOLKIT.SceneManager.GetLastCreatedScene(), null, {
                spatialSound: true,
                distanceModel: "linear",
                volume: 1.0
            });
            
            return audioSrc;
        }

        private static destroyAudioSrc(audioSrc: BABYLON.Sound): void {
            audioSrc.dispose();
        }

        public static setGamePaused(paused: boolean): void {
            TOOLKIT.SceneManager.GetLastCreatedScene().getAnimationRatio = paused ? () => 0 : () => 1;
        }

        public static playAudioAtLoc(audioToPlay: string, playLoc: BABYLON.Vector3, volume: number): void {
            let audioSrc: BABYLON.Sound = null;
            
            if (this.audioPool.length > 0) {
                audioSrc = this.audioPool.pop();
            } else {
                audioSrc = this.createAudioSrc();
            }
            
            audioSrc.setVolume(volume);
            audioSrc.setPosition(playLoc);
            
            audioSrc.setBuffer(audioToPlay);
            audioSrc.play();
            
            setTimeout(() => {
                if (this.audioPool.length < this.maxPoolSize) {
                    this.audioPool.push(audioSrc);
                } else {
                    this.destroyAudioSrc(audioSrc);
                }
            }, audioSrc.length * 1000);
        }

        public static playAudioAtPlayer(abilityAudio: string, volume: number): void {
            const camera = TOOLKIT.SceneManager.GetLastCreatedScene().activeCamera;
            this.playAudioAtLoc(abilityAudio, camera.position, volume);
        }
    }
}
