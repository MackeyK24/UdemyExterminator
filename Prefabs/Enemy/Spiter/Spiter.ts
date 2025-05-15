/**
 * Spiter - Enemy that attacks by shooting projectiles
 */
namespace PROJECT {
    export class Spiter extends PROJECT.Enemy {
        private projectilePrefab: PROJECT.Projectile = null;
        private launchPoint: BABYLON.TransformNode = null;
        private destination: BABYLON.Vector3 = null;
        private animator: TOOLKIT.AnimationState = null;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.Spiter");
        }
        
        protected awake(): void {
            this.animator = new TOOLKIT.AnimationState(this.transform, this.scene);
        }
        
        public override attackTarget(target: BABYLON.TransformNode): void {
            this.animator.setTrigger("Attack");
            this.destination = target.position;
        }
        
        public shoot(): void {
            const newProjectile = TOOLKIT.SceneManager.InstantiatePrefabFromContainer(
                this.launchPoint, 
                this.projectilePrefab.transform.name, 
                "Projectile"
            );
            
            const projectileComponent = newProjectile.getComponent("PROJECT.Projectile") as PROJECT.Projectile;
            if (projectileComponent) {
                projectileComponent.launch(this.transform, this.destination);
            }
        }
    }
}
