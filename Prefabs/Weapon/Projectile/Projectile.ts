namespace PROJECT {
    export class Projectile extends TOOLKIT.ScriptComponent {
        private flightHeight: number;
        private rigidBody: BABYLON.PhysicsImpostor;
        private damageComponent: PROJECT.DamageComponent;
        private explosionVFX: BABYLON.ParticleSystem;
        private instigatorTeamInterface: PROJECT.ITeamInterface;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.Projectile") {
            super(transform, scene, properties, alias);
        }
        
        public launch(instigator: BABYLON.TransformNode, destination: BABYLON.Vector3): void {
            this.instigatorTeamInterface = TOOLKIT.SceneManager.FindScriptComponent(instigator, "PROJECT.ITeamInterface") as PROJECT.ITeamInterface;
            
            if (this.instigatorTeamInterface) {
                this.damageComponent.setTeamInterfaceSrc(this.instigatorTeamInterface);
            }
            
            const gravity = 9.81; // Physics gravity magnitude
            const halfFlightTime = Math.sqrt((this.flightHeight * 2.0) / gravity);
            
            const destinationVec = destination.subtract(this.transform.position);
            destinationVec.y = 0;
            const horizontalDist = destinationVec.length();
            
            const upSpeed = halfFlightTime * gravity;
            const fwdSpeed = horizontalDist / (2.0 * halfFlightTime);
            
            const upVector = new BABYLON.Vector3(0, 1, 0);
            const normalizedDestination = destinationVec.normalize();
            
            const flightVel = upVector.scale(upSpeed).add(normalizedDestination.scale(fwdSpeed));
            
            if (this.transform.physicsBody) {
                this.transform.physicsBody.setLinearVelocity(flightVel);
            }
        }
        
        public onTriggerEnter(other: BABYLON.TransformNode): void {
            const otherTeamInterface = TOOLKIT.SceneManager.FindScriptComponent(other, "PROJECT.ITeamInterface") as PROJECT.ITeamInterface;
            
            if (otherTeamInterface && this.instigatorTeamInterface) {
                if (this.instigatorTeamInterface.getRelationTowards(other) !== PROJECT.ETeamRelation.Friendly) {
                    this.explode();
                }
            }
        }
        
        private explode(): void {
            const position = this.transform.position;
            
            const explosion = TOOLKIT.SceneManager.InstantiatePrefab(this.explosionVFX, position, BABYLON.Quaternion.Identity());
            
            TOOLKIT.SceneManager.DestroyTransformNode(this.transform);
        }
    }
}
