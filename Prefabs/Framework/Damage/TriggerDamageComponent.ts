/**
 * TriggerDamageComponent - Applies damage when a trigger collider is entered
 */
namespace PROJECT {
    export class TriggerDamageComponent extends PROJECT.DamageComponent {
        private damage: number = 10.0;
        private trigger: BABYLON.Mesh = null;
        private startedEnabled: boolean = false;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.TriggerDamageComponent");
        }
        
        public setDamageEnabled(enabled: boolean): void {
            if (this.trigger) {
                this.trigger.isEnabled = enabled;
            }
        }
        
        protected start(): void {
            this.setDamageEnabled(this.startedEnabled);
            
            if (this.trigger) {
                this.trigger.actionManager = new BABYLON.ActionManager(this.scene);
                this.trigger.actionManager.registerAction(
                    new BABYLON.ExecuteCodeAction(
                        BABYLON.ActionManager.OnIntersectionEnterTrigger,
                        (evt) => {
                            const otherMesh = evt.source;
                            if (!otherMesh) return;
                            
                            const otherTransform = otherMesh;
                            
                            if (!this.shouldDamage(otherTransform)) return;
                            
                            const healthComp = TOOLKIT.SceneManager.FindScriptComponent(
                                otherTransform,
                                "PROJECT.HealthComponent"
                            ) as PROJECT.HealthComponent;
                            
                            if (healthComp) {
                                healthComp.changeHealth(-this.damage, this.transform);
                            }
                        }
                    )
                );
            }
        }
    }
}
