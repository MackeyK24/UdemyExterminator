namespace PROJECT {
    export class LevelManager {
        private mainMenuBuildIndex: number = 0;
        private firstLevelBuildIndex: number = 1;
        
        public static onLevelFinished: (() => void)[] = [];
        
        public static levelFinished(): void {
            for (const callback of PROJECT.LevelManager.onLevelFinished) {
                callback();
            }
        }
        
        public goToMainMenu(): void {
            this.loadSceneByIndex(this.mainMenuBuildIndex);
        }
        
        public loadFirstLevel(): void {
            this.loadSceneByIndex(this.firstLevelBuildIndex);
        }
        
        public restartCurrentLevel(): void {
            const activeScene = TOOLKIT.SceneManager.GetLastCreatedScene();
            this.loadSceneByIndex(activeScene.buildIndex);
        }
        
        private loadSceneByIndex(index: number): void {
            TOOLKIT.SceneManager.LoadScene(index);
            PROJECT.GameplayStatics.setGamePaused(false);
        }
    }
}
