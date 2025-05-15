/**
 * HealthUIComponent - Spawns and initializes health bar UI for entities
 */
namespace PROJECT {
    export class HealthUIComponent extends TOOLKIT.ScriptComponent {
        private healthBarToSpawn: PROJECT.HealthBar = null;
        private healthBarAttachPoint: BABYLON.TransformNode = null;
        private healthComponent: PROJECT.HealthComponent = null;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.HealthUIComponent");
        }
        
        protected start(): void {
            const inGameUI = TOOLKIT.SceneManager.FindScriptComponent(
                null, 
                "PROJECT.InGameUI"
            ) as PROJECT.InGameUI;
            
            if (inGameUI && this.healthBarToSpawn && this.healthBarAttachPoint && this.healthComponent) {
                const newHealthBar = TOOLKIT.SceneManager.InstantiatePrefab(
                    this.healthBarToSpawn, 
                    inGameUI.transform
                ) as PROJECT.HealthBar;
                
                newHealthBar.init(this.healthBarAttachPoint);
                
                this.healthComponent.registerOnHealthChange(newHealthBar.setHealthSliderValue.bind(newHealthBar));
                this.healthComponent.registerOnHealthEmpty(newHealthBar.onOwnerDead.bind(newHealthBar));
            }
        }
    }
}
