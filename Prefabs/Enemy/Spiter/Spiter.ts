namespace PROJECT {
    export class Spiter extends PROJECT.Enemy {
        private projectilePrefab: PROJECT.Projectile;
        private launchPoint: BABYLON.TransformNode;
        
        private destination: BABYLON.Vector3;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.Spiter") {
            super(transform, scene, properties, alias);
        }
        
        public override attackTarget(target: BABYLON.TransformNode): void {
            this.animatorComponent.setTrigger("Attack");
            this.destination = target.position;
        }
        
        public shoot(): void {
            const newProjectile = TOOLKIT.SceneManager.InstantiatePrefab(
                this.projectilePrefab.transform,
                this.launchPoint.position,
                this.launchPoint.rotationQuaternion
            ) as PROJECT.Projectile;
            
            newProjectile.launch(this.transform, this.destination);
        }
    }
}
