namespace PROJECT {
    export class UIManager extends TOOLKIT.ScriptComponent {
        private gameplayControl: BABYLON.GUI.CanvasGroup;
        private pauseMenu: BABYLON.GUI.CanvasGroup;
        private shop: BABYLON.GUI.CanvasGroup;
        private deathMenu: BABYLON.GUI.CanvasGroup;
        private winMenu: BABYLON.GUI.CanvasGroup;
        private uiAudioPlayer: PROJECT.UIAudioPlayer;
        
        private allChildren: BABYLON.GUI.CanvasGroup[] = [];
        private currentActiveGrp: BABYLON.GUI.CanvasGroup;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.UIManager") {
            super(transform, scene, properties, alias);
            
            if (properties.gameplayControl) this.gameplayControl = properties.gameplayControl;
            if (properties.pauseMenu) this.pauseMenu = properties.pauseMenu;
            if (properties.shop) this.shop = properties.shop;
            if (properties.deathMenu) this.deathMenu = properties.deathMenu;
            if (properties.winMenu) this.winMenu = properties.winMenu;
            if (properties.uiAudioPlayer) this.uiAudioPlayer = properties.uiAudioPlayer;
        }

        protected start(): void {
            const children: BABYLON.GUI.CanvasGroup[] = [];
            const childComponents = this.transform.getChildMeshes();
            for (let i = 0; i < childComponents.length; i++) {
                const canvasGroup = TOOLKIT.SceneManager.FindScriptComponent(childComponents[i], "BABYLON.GUI.CanvasGroup") as BABYLON.GUI.CanvasGroup;
                if (canvasGroup) {
                    children.push(canvasGroup);
                }
            }
            
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                if (child.transform.parent === this.transform) {
                    this.allChildren.push(child);
                    this.setGroupActive(child, false, false);
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

        private setCurrentActiveGrp(canvasGroup: BABYLON.GUI.CanvasGroup): void {
            if (this.currentActiveGrp != null) {
                this.setGroupActive(this.currentActiveGrp, false, false);
            }
            
            this.currentActiveGrp = canvasGroup;
            this.setGroupActive(this.currentActiveGrp, true, true);
        }

        private setGroupActive(child: BABYLON.GUI.CanvasGroup, interactable: boolean, visible: boolean): void {
            child.interactable = interactable;
            child.blocksRaycasts = interactable;
            child.alpha = visible ? 1 : 0;
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

        private setCanvasGroupEnabled(grp: BABYLON.GUI.CanvasGroup, enabled: boolean): void {
            grp.interactable = enabled;
            grp.blocksRaycasts = enabled;
        }

        public swithToDeathMenu(): void {
            this.setCurrentActiveGrp(this.deathMenu);
            PROJECT.GameplayStatics.setGamePaused(true);
        }
    }
}
