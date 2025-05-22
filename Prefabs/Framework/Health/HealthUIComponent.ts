namespace PROJECT {
    export class HealthUIComponent extends TOOLKIT.ScriptComponent {
        private healthBarToSpawn: PROJECT.HealthBar;
        private healthBarAttachPoint: BABYLON.TransformNode;
        private healthComponent: PROJECT.HealthComponent;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.HealthUIComponent") {
            super(transform, scene, properties, alias);
            
            if (properties.healthBarToSpawn) this.healthBarToSpawn = properties.healthBarToSpawn;
            if (properties.healthBarAttachPoint) this.healthBarAttachPoint = properties.healthBarAttachPoint;
            if (properties.healthComponent) this.healthComponent = properties.healthComponent;
        }

        protected start(): void {
            const inGameUI = TOOLKIT.SceneManager.FindScriptComponent(this.scene, "PROJECT.InGameUI") as PROJECT.InGameUI;
            const newHealthBar = TOOLKIT.SceneManager.InstantiatePrefab(
                this.healthBarToSpawn, 
                this.scene
            ) as PROJECT.HealthBar;
            
            newHealthBar.init(this.healthBarAttachPoint);
            
            this.healthComponent.onHealthChange.push(newHealthBar.setHealthSliderValue.bind(newHealthBar));
            this.healthComponent.onHealthEmpty.push(newHealthBar.onOwnerDead.bind(newHealthBar));
        }
    }
}
