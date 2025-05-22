namespace PROJECT {
    export class UIManager extends TOOLKIT.ScriptComponent {
        private gameplayControl: BABYLON.GUI.Container;
        private pauseMenu: BABYLON.GUI.Container;
        private shop: BABYLON.GUI.Container;
        private deathMenu: BABYLON.GUI.Container;
        private winMenu: BABYLON.GUI.Container;
        private uiAudioPlayer: PROJECT.UIAudioPlayer;
        
        private allChildren: BABYLON.GUI.Container[] = [];
        private currentActiveGrp: BABYLON.GUI.Container;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.UIManager") {
            super(transform, scene, properties, alias);
        }
        
        protected start(): void {
            const children = this.transform.getChildren();
            
            for (const child of children) {
                const container = TOOLKIT.SceneManager.FindScriptComponent(child, "BABYLON.GUI.Container") as BABYLON.GUI.Container;
                if (container) {
                    this.allChildren.push(container);
                    this.setGroupActive(container, false, false);
                }
            }
            
            if (this.allChildren.length !== 0) {
                this.setCurrentActiveGrp(this.allChildren[0]);
            }
            
            PROJECT.LevelManager.onLevelFinished.push(this.levelFinished.bind(this));
        }
        
        private levelFinished(): void {
            this.setCurrentActiveGrp(this.winMenu);
            PROJECT.GameplayStatics.setGamePaused(true);
            this.uiAudioPlayer.playWin();
        }
        
        public swithToGameplayUI(): void {
            this.setCurrentActiveGrp(this.gameplayControl);
            PROJECT.GameplayStatics.setGamePaused(false);
        }
        
        private setCurrentActiveGrp(canvasGroup: BABYLON.GUI.Container): void {
            if (this.currentActiveGrp != null) {
                this.setGroupActive(this.currentActiveGrp, false, false);
            }
            
            this.currentActiveGrp = canvasGroup;
            this.setGroupActive(this.currentActiveGrp, true, true);
        }
        
        private setGroupActive(container: BABYLON.GUI.Container, interactable: boolean, visible: boolean): void {
            container.isEnabled = interactable;
            container.isVisible = visible;
            container.alpha = visible ? 1 : 0;
        }
        
        public setGameplayControlEnabled(enabled: boolean): void {
            this.setCanvasGroupEnabled(this.gameplayControl, enabled);
        }
        
        public swithToPauseMenu(): void {
            this.setCurrentActiveGrp(this.pauseMenu);
            PROJECT.GameplayStatics.setGamePaused(true);
        }
        
        public swithToShop(): void {
            this.setCurrentActiveGrp(this.shop);
            PROJECT.GameplayStatics.setGamePaused(true);
        }
        
        private setCanvasGroupEnabled(container: BABYLON.GUI.Container, enabled: boolean): void {
            container.isEnabled = enabled;
        }
        
        public swithToDeathMenu(): void {
            this.setCurrentActiveGrp(this.deathMenu);
            PROJECT.GameplayStatics.setGamePaused(true);
        }
    }
}
