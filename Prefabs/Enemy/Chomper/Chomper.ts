/**
 * Chomper - Enemy that attacks with melee damage
 */
namespace PROJECT {
    export class Chomper extends PROJECT.Enemy {
        private damageComponent: PROJECT.TriggerDamageComponent = null;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.Chomper");
        }
        
        public override attackTarget(target: BABYLON.TransformNode): void {
            if (this.animator) {
                this.animator.setTrigger("Attack");
            }
        }
        
        public attackPoint(): void {
            if (this.damageComponent) {
                this.damageComponent.setDamageEnabled(true);
            }
        }
        
        public attackEnd(): void {
            if (this.damageComponent) {
                this.damageComponent.setDamageEnabled(false);
            }
        }
        
        protected override start(): void {
            super.start();
            
            if (this.damageComponent) {
                this.damageComponent.setTeamInterfaceSrc(this);
            }
        }
    }
}
