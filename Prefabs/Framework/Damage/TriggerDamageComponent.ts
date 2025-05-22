namespace PROJECT {
    export class TriggerDamageComponent extends PROJECT.DamageComponent {
        private damage: number;
        private trigger: BABYLON.Mesh;
        private startedEnabled: boolean = false;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.TriggerDamageComponent") {
            super(transform, scene, properties, alias);
        }
        
        public setDamageEnabled(enabled: boolean): void {
            if (this.trigger) {
                this.trigger.isEnabled = enabled;
            }
        }
        
        protected start(): void {
            this.setDamageEnabled(this.startedEnabled);
            
            if (this.transform.physicsBody) {
                this.transform.physicsBody.onCollideEvent = (collider) => {
                    if (!this.shouldDamage(collider)) {
                        return;
                    }
                    
                    const healthComp = TOOLKIT.SceneManager.FindScriptComponent(collider, "PROJECT.HealthComponent") as PROJECT.HealthComponent;
                    if (healthComp != null) {
                        healthComp.changeHealth(-this.damage, this.transform);
                    }
                };
            }
        }
    }
}
