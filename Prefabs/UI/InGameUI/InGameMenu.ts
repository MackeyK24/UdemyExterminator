/**
 * InGameMenu - Manages in-game menu UI and button interactions
 */
namespace PROJECT {
    export class InGameMenu extends TOOLKIT.ScriptComponent {
        private resumeBtn: BABYLON.GUI.Button = null;
        private restartBtn: BABYLON.GUI.Button = null;
        private mainMenuBtn: BABYLON.GUI.Button = null;
        private uiManager: PROJECT.UIManager = null;
        private levelManager: PROJECT.LevelManager = null;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.InGameMenu");
        }

        protected start(): void {
            if (this.resumeBtn) {
                this.resumeBtn.onPointerClickObservable.add(this.resumeGame.bind(this));
            }
            
            if (this.restartBtn) {
                this.restartBtn.onPointerClickObservable.add(this.restartLevel.bind(this));
            }
            
            if (this.mainMenuBtn) {
                this.mainMenuBtn.onPointerClickObservable.add(this.backToMainMenu.bind(this));
            }
        }

        private backToMainMenu(): void {
            if (this.levelManager) {
                this.levelManager.goToMainMenu();
            }
        }

        private restartLevel(): void {
            if (this.levelManager) {
                this.levelManager.restartCurrentLevel();
            }
        }

        private resumeGame(): void {
            if (this.uiManager) {
                this.uiManager.switchToGameplayUI();
            }
        }
    }
}
