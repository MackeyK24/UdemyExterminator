/**
 * Projectile - Handles projectile physics, damage, and explosion effects
 */
namespace PROJECT {
    export class Projectile extends TOOLKIT.ScriptComponent {
        private flightHeight: number = 0;
        private rigidBody: BABYLON.PhysicsImpostor = null;
        private damageComponent: PROJECT.DamageComponent = null;
        private explosionVFX: BABYLON.ParticleSystem = null;
        private instigatorTeamInterface: PROJECT.ITeamInterface = null;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.Projectile");
        }

        public launch(instigator: BABYLON.TransformNode, destination: BABYLON.Vector3): void {
            this.instigatorTeamInterface = TOOLKIT.SceneManager.FindScriptComponent(
                instigator, 
                "PROJECT.ITeamInterface"
            ) as PROJECT.ITeamInterface;
            
            if (this.instigatorTeamInterface) {
                this.damageComponent.setTeamInterfaceSrc(this.instigatorTeamInterface);
            }
            
            const gravity: number = 9.81; // Physics gravity magnitude
            const halfFlightTime: number = Math.sqrt((this.flightHeight * 2.0) / gravity);
            
            const destinationVec = destination.subtract(this.transform.position);
            destinationVec.y = 0;
            const horizontalDist: number = destinationVec.length();
            
            const upSpeed: number = halfFlightTime * gravity;
            const fwdSpeed: number = horizontalDist / (2.0 * halfFlightTime);
            
            const upVector = new BABYLON.Vector3(0, 1, 0).scale(upSpeed);
            const fwdVector = destinationVec.normalize().scale(fwdSpeed);
            const flightVel = upVector.add(fwdVector);
            
            if (this.transform.physicsBody) {
                this.transform.physicsBody.setLinearVelocity(flightVel);
            }
        }

        protected onTriggerEnter(other: BABYLON.AbstractMesh): void {
            if (this.instigatorTeamInterface) {
                const otherTeamRelation = this.instigatorTeamInterface.getRelationTowards(other);
                if (otherTeamRelation !== PROJECT.ETeamRelation.Friendly) {
                    this.explode();
                }
            }
        }

        private explode(): void {
            const position = this.transform.position;
            
            if (this.explosionVFX) {
                const explosion = TOOLKIT.SceneManager.InstantiatePrefab(
                    this.explosionVFX, 
                    null
                ) as BABYLON.ParticleSystem;
                
                explosion.emitter = new BABYLON.TransformNode("explosion", this.scene);
                explosion.emitter.position = position;
                explosion.start();
            }
            
            this.transform.dispose();
        }
    }
}
