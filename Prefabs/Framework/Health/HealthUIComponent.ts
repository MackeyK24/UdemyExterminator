namespace PROJECT {
    export class HealthUIComponent extends TOOLKIT.ScriptComponent {
        private healthBarToSpawn: PROJECT.HealthBar;
        private healthBarAttachPoint: BABYLON.TransformNode;
        private healthComponent: PROJECT.HealthComponent;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.HealthUIComponent") {
            super(transform, scene, properties, alias);
        }
        
        protected start(): void {
            const inGameUI = TOOLKIT.SceneManager.SearchForScriptComponentByName(this.scene, "PROJECT.InGameUI") as PROJECT.InGameUI;
            
            if (inGameUI) {
                const newHealthBar = TOOLKIT.SceneManager.InstantiatePrefabFromContainer(
                    this.scene,
                    this.healthBarToSpawn.transform.name,
                    "HealthBar_" + this.transform.name
                );
                
                const healthBarComponent = TOOLKIT.SceneManager.FindScriptComponent(newHealthBar, "PROJECT.HealthBar") as PROJECT.HealthBar;
                
                if (healthBarComponent) {
                    healthBarComponent.init(this.healthBarAttachPoint);
                    
                    if (this.healthComponent) {
                        this.healthComponent.onHealthChange.push(healthBarComponent.setHealthSliderValue.bind(healthBarComponent));
                        this.healthComponent.onHealthEmpty.push(healthBarComponent.onOwnerDead.bind(healthBarComponent));
                    }
                }
            }
        }
    }
}
