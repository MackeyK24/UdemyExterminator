namespace PROJECT {
    export class Projectile extends TOOLKIT.ScriptComponent {
        private flightHeight: number;
        private rigidBody: BABYLON.PhysicsImpostor;
        private damageComponent: PROJECT.DamageComponent;
        private explosionVFX: BABYLON.ParticleSystem;
        private instigatorTeamInterface: PROJECT.ITeamInterface;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.Projectile") {
            super(transform, scene, properties, alias);
            
            if (properties.flightHeight) this.flightHeight = properties.flightHeight;
            if (properties.rigidBody) this.rigidBody = properties.rigidBody;
            if (properties.damageComponent) this.damageComponent = properties.damageComponent;
            if (properties.explosionVFX) this.explosionVFX = properties.explosionVFX;
        }

        public launch(instigator: BABYLON.TransformNode, destination: BABYLON.Vector3): void {
            this.instigatorTeamInterface = TOOLKIT.SceneManager.FindScriptComponent(instigator, "PROJECT.ITeamInterface") as PROJECT.ITeamInterface;
            if (this.instigatorTeamInterface != null) {
                this.damageComponent.setTeamInterfaceSrc(this.instigatorTeamInterface);
            }
            
            const gravity = 9.81; // Physics gravity magnitude
            const halfFlightTime = Math.sqrt((this.flightHeight * 2.0) / gravity);

            const destinationVec = destination.subtract(this.transform.position);
            destinationVec.y = 0;
            const horizontalDist = destinationVec.length();
            
            const upSpeed = halfFlightTime * gravity;
            const fwdSpeed = horizontalDist / (2.0 * halfFlightTime);

            const flightVel = BABYLON.Vector3.Up().scale(upSpeed).add(destinationVec.normalize().scale(fwdSpeed));
            this.rigidBody.setLinearVelocity(flightVel);
        }

        protected start(): void {
            if (this.transform.physicsBody) {
                this.transform.physicsBody.onCollideObservable.add((collidedMesh) => {
                    if (this.instigatorTeamInterface.getRelationTowards(collidedMesh) != PROJECT.ETeamRelation.Friendly) {
                        this.explode();
                    }
                });
            }
        }

        private explode(): void {
            const pawnPos = this.transform.position;
            
            const explosion = this.explosionVFX.clone("explosion", this.scene);
            explosion.emitter = new BABYLON.Vector3(pawnPos.x, pawnPos.y, pawnPos.z);
            explosion.start();
            
            this.transform.dispose();
        }
    }
}
