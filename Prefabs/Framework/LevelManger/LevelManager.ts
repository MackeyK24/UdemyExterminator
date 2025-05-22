namespace PROJECT {
    export class LevelManager extends TOOLKIT.ScriptComponent {
        private mainMenuBuildIndex: number = 0;
        private firstLevelBuildIndex: number = 1;
        
        public onLevelFinished: (() => void)[] = [];
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.LevelManager") {
            super(transform, scene, properties, alias);
        }
        
        public static levelFinished(): void {
            const levelManager = TOOLKIT.SceneManager.SearchForScriptComponentByName(
                TOOLKIT.SceneManager.GetLastCreatedScene(),
                "PROJECT.LevelManager"
            ) as PROJECT.LevelManager;
            
            if (levelManager) {
                for (const callback of levelManager.onLevelFinished) {
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
            this.loadSceneByIndex(this.scene.name ? parseInt(this.scene.name) : 0);
        }
        
        private loadSceneByIndex(index: number): void {
            TOOLKIT.SceneManager.LoadScene(index.toString());
            PROJECT.GameplayStatics.setGamePaused(false);
        }
    }
}
