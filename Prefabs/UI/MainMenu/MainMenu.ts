namespace PROJECT {
    export class MainMenu extends TOOLKIT.ScriptComponent {
        private startBtn: BABYLON.GUI.Button;
        private controlsBtn: BABYLON.GUI.Button;
        private backBtn: BABYLON.GUI.Button;
        private frontUI: BABYLON.GUI.AdvancedDynamicTexture;
        private controllsUI: BABYLON.GUI.AdvancedDynamicTexture;
        private levelManager: PROJECT.LevelManager;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.MainMenu") {
            super(transform, scene, properties, alias);
        }
        
        protected start(): void {
            this.startBtn.onPointerClickObservable.add(this.startGame.bind(this));
            this.controlsBtn.onPointerClickObservable.add(this.swithToControlUI.bind(this));
            this.backBtn.onPointerClickObservable.add(this.switchToFrontUI.bind(this));
        }
        
        private switchToFrontUI(): void {
            this.controllsUI.rootContainer.isVisible = false;
            this.controllsUI.rootContainer.alpha = 0;
            
            this.frontUI.rootContainer.isVisible = true;
            this.frontUI.rootContainer.alpha = 1;
        }
        
        private swithToControlUI(): void {
            this.controllsUI.rootContainer.isVisible = true;
            this.controllsUI.rootContainer.alpha = 1;
            
            this.frontUI.rootContainer.isVisible = false;
            this.frontUI.rootContainer.alpha = 0;
        }
        
        private startGame(): void {
            this.levelManager.loadFirstLevel();
        }
    }
}
