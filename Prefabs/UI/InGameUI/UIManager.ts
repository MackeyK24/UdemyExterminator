/**
 * UIManager - Manages UI canvas groups and menu transitions
 */
namespace PROJECT {
    export class UIManager extends TOOLKIT.ScriptComponent {
        private gameplayControl: BABYLON.GUI.Container = null;
        private pauseMenu: BABYLON.GUI.Container = null;
        private shop: BABYLON.GUI.Container = null;
        private deathMenu: BABYLON.GUI.Container = null;
        private winMenu: BABYLON.GUI.Container = null;
        private uiAudioPlayer: PROJECT.UIAudioPlayer = null;
        
        private allChildren: BABYLON.GUI.Container[] = [];
        private currentActiveGrp: BABYLON.GUI.Container = null;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.UIManager");
        }
        
        protected start(): void {
            const children: BABYLON.GUI.Container[] = [];
            const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);
            
            for (let control of advancedTexture.getChildren() as BABYLON.GUI.Container[]) {
                if (control.parent === advancedTexture) {
                    this.allChildren.push(control);
                    this.setGroupActive(control, false, false);
                }
            }
            
            if (this.allChildren.length !== 0) {
                this.setCurrentActiveGrp(this.allChildren[0]);
            }
            
            const levelManager = TOOLKIT.SceneManager.FindScriptComponent(null, "PROJECT.LevelManager") as PROJECT.LevelManager;
            if (levelManager) {
                levelManager.registerOnLevelFinished(this.levelFinished.bind(this));
            }
        }
        
        private levelFinished(): void {
            this.setCurrentActiveGrp(this.winMenu);
            PROJECT.GameplayStatics.setGamePaused(true);
            this.uiAudioPlayer.playWin();
        }
        
        public switchToGameplayUI(): void {
            this.setCurrentActiveGrp(this.gameplayControl);
            PROJECT.GameplayStatics.setGamePaused(false);
        }
        
        private setCurrentActiveGrp(canvasGroup: BABYLON.GUI.Container): void {
            if (this.currentActiveGrp) {
                this.setGroupActive(this.currentActiveGrp, false, false);
            }
            
            this.currentActiveGrp = canvasGroup;
            this.setGroupActive(this.currentActiveGrp, true, true);
        }
        
        private setGroupActive(container: BABYLON.GUI.Container, interactable: boolean, visible: boolean): void {
            container.isEnabled = interactable;
            container.isPointerBlocker = interactable;
            container.alpha = visible ? 1 : 0;
        }
        
        public setGameplayControlEnabled(enabled: boolean): void {
            this.setCanvasGroupEnabled(this.gameplayControl, enabled);
        }
        
        public switchToPauseMenu(): void {
            this.setCurrentActiveGrp(this.pauseMenu);
            PROJECT.GameplayStatics.setGamePaused(true);
        }
        
        public switchToShop(): void {
            this.setCurrentActiveGrp(this.shop);
            PROJECT.GameplayStatics.setGamePaused(true);
        }
        
        private setCanvasGroupEnabled(container: BABYLON.GUI.Container, enabled: boolean): void {
            container.isEnabled = enabled;
            container.isPointerBlocker = enabled;
        }
        
        public switchToDeathMenu(): void {
            this.setCurrentActiveGrp(this.deathMenu);
            PROJECT.GameplayStatics.setGamePaused(true);
        }
    }
}
