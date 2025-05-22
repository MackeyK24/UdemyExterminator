namespace PROJECT {
    export class Spiter extends PROJECT.Enemy {
        private projectilePrefab: PROJECT.Projectile;
        private launchPoint: BABYLON.TransformNode;
        private destination: BABYLON.Vector3;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.Spiter") {
            super(transform, scene, properties, alias);
            
            if (properties.projectilePrefab) this.projectilePrefab = properties.projectilePrefab;
            if (properties.launchPoint) this.launchPoint = properties.launchPoint;
        }

        public attackTarget(target: BABYLON.TransformNode): void {
            this.getAnimator().setTrigger("Attack");
            this.destination = target.position.clone();
        }

        public shoot(): void {
            const newProjectile = TOOLKIT.SceneManager.InstantiatePrefab(
                this.projectilePrefab, 
                this.scene
            ) as PROJECT.Projectile;
            
            newProjectile.transform.position = this.launchPoint.position.clone();
            newProjectile.transform.rotationQuaternion = this.launchPoint.rotationQuaternion.clone();
            
            newProjectile.launch(this.transform, this.destination);
        }
    }
}
