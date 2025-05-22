namespace PROJECT {
    export class InGameMenu extends TOOLKIT.ScriptComponent {
        private resumeBtn: BABYLON.GUI.Button;
        private restartBtn: BABYLON.GUI.Button;
        private mainMenu: BABYLON.GUI.Button;
        private uiManager: PROJECT.UIManager;
        private levelManager: PROJECT.LevelManager;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.InGameMenu") {
            super(transform, scene, properties, alias);
        }
        
        protected start(): void {
            this.resumeBtn.onPointerClickObservable.add(this.resumeGame.bind(this));
            this.restartBtn.onPointerClickObservable.add(this.restartLevel.bind(this));
            this.mainMenu.onPointerClickObservable.add(this.backToMainMenu.bind(this));
        }
        
        private backToMainMenu(): void {
            this.levelManager.goToMainMenu();
        }
        
        private restartLevel(): void {
            this.levelManager.restartCurrentLevel();
        }
        
        private resumeGame(): void {
            this.uiManager.swithToGameplayUI();
        }
    }
}
