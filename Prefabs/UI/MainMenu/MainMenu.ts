/**
 * MainMenu - Manages main menu UI and button interactions
 */
namespace PROJECT {
    export class MainMenu extends TOOLKIT.ScriptComponent {
        private startBtn: BABYLON.GUI.Button = null;
        private controlsBtn: BABYLON.GUI.Button = null;
        private backBtn: BABYLON.GUI.Button = null;
        private frontUI: BABYLON.GUI.Container = null;
        private controllsUI: BABYLON.GUI.Container = null;
        private levelManager: PROJECT.LevelManager = null;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.MainMenu");
        }

        protected start(): void {
            if (this.startBtn) {
                this.startBtn.onPointerClickObservable.add(this.startGame.bind(this));
            }
            
            if (this.controlsBtn) {
                this.controlsBtn.onPointerClickObservable.add(this.swithToControlUI.bind(this));
            }
            
            if (this.backBtn) {
                this.backBtn.onPointerClickObservable.add(this.switchToFrontUI.bind(this));
            }
        }

        private switchToFrontUI(): void {
            if (this.controllsUI) {
                this.controllsUI.isPointerBlocker = false;
                this.controllsUI.alpha = 0;
            }

            if (this.frontUI) {
                this.frontUI.isPointerBlocker = true;
                this.frontUI.alpha = 1;
            }
        }

        private swithToControlUI(): void {
            if (this.controllsUI) {
                this.controllsUI.isPointerBlocker = true;
                this.controllsUI.alpha = 1;
            }

            if (this.frontUI) {
                this.frontUI.isPointerBlocker = false;
                this.frontUI.alpha = 0;
            }
        }

        private startGame(): void {
            if (this.levelManager) {
                this.levelManager.loadFirstLevel();
            }
        }
    }
}
