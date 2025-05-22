namespace PROJECT {
    export class TriggerDamageComponent extends PROJECT.DamageComponent {
        private damage: number;
        private trigger: BABYLON.BoxCollider;
        private startedEnabled: boolean = false;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.TriggerDamageComponent") {
            super(transform, scene, properties, alias);
            
            if (properties.damage) this.damage = properties.damage;
            if (properties.trigger) this.trigger = properties.trigger;
            if (properties.startedEnabled) this.startedEnabled = properties.startedEnabled;
        }

        public setDamageEnabled(enabled: boolean): void {
            this.trigger.isEnabled = enabled;
        }

        protected start(): void {
            this.setDamageEnabled(this.startedEnabled);
        }

        public onTriggerEnter(other: BABYLON.AbstractMesh): void {
            if (!this.shouldDamage(other)) {
                return;
            }

            const healthComp = TOOLKIT.SceneManager.FindScriptComponent(other, "PROJECT.HealthComponent") as PROJECT.HealthComponent;
            if (healthComp != null) {
                healthComp.changeHealth(-this.damage, this.transform);
            }
        }
    }
}
