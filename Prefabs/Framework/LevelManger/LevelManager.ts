/**
 * LevelManager - Manages level loading and scene transitions
 */
namespace PROJECT {
    export class LevelManager extends TOOLKIT.ScriptComponent {
        private mainMenuBuildIndex: number = 0;
        private firstLevelBuildIndex: number = 1;
        private static onLevelFinishedCallbacks: (() => void)[] = [];
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.LevelManager");
        }
        
        public static levelFinished(): void {
            if (this.onLevelFinishedCallbacks.length > 0) {
                for (const callback of this.onLevelFinishedCallbacks) {
                    callback();
                }
            }
        }
        
        public goToMainMenu(): void {
            this.loadSceneByIndex(this.mainMenuBuildIndex);
        }
        
        public loadFirstLevel(): void {
            this.loadSceneByIndex(this.firstLevelBuildIndex);
        }
        
        public restartCurrentLevel(): void {
            const currentSceneIndex = BABYLON.SceneManager.GetActiveScene().buildIndex;
            this.loadSceneByIndex(currentSceneIndex);
        }
        
        private loadSceneByIndex(index: number): void {
            BABYLON.SceneManager.LoadScene(index);
            PROJECT.GameplayStatics.setGamePaused(false);
        }
    }
}
