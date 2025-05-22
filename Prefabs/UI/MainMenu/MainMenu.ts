namespace PROJECT {
    export class MainMenu extends TOOLKIT.ScriptComponent {
        private startBtn: BABYLON.GUI.Button;
        private controlsBtn: BABYLON.GUI.Button;
        private backBtn: BABYLON.GUI.Button;
        private frontUI: BABYLON.GUI.CanvasGroup;
        private controllsUI: BABYLON.GUI.CanvasGroup;
        private levelManager: PROJECT.LevelManager;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.MainMenu") {
            super(transform, scene, properties, alias);
            
            if (properties.startBtn) this.startBtn = properties.startBtn;
            if (properties.controlsBtn) this.controlsBtn = properties.controlsBtn;
            if (properties.backBtn) this.backBtn = properties.backBtn;
            if (properties.frontUI) this.frontUI = properties.frontUI;
            if (properties.controllsUI) this.controllsUI = properties.controllsUI;
            if (properties.levelManager) this.levelManager = properties.levelManager;
        }

        protected start(): void {
            this.startBtn.onPointerClickObservable.add(this.startGame.bind(this));
            this.controlsBtn.onPointerClickObservable.add(this.swithToControlUI.bind(this));
            this.backBtn.onPointerClickObservable.add(this.switchToFrontUI.bind(this));
        }

        private switchToFrontUI(): void {
            this.controllsUI.blocksRaycasts = false;
            this.controllsUI.alpha = 0;

            this.frontUI.blocksRaycasts = true;
            this.frontUI.alpha = 1;
        }

        private swithToControlUI(): void {
            this.controllsUI.blocksRaycasts = true;
            this.controllsUI.alpha = 1;

            this.frontUI.blocksRaycasts = false;
            this.frontUI.alpha = 0;
        }

        private startGame(): void {
            this.levelManager.loadFirstLevel();
        }
    }
}
