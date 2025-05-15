/**
 * RangedWeapon - Handles ranged weapon functionality
 */
namespace PROJECT {
    export class RangedWeapon extends PROJECT.Weapon {
        private aimComp: PROJECT.AimComponent = null;
        private damage: number = 5;
        private bulletVfx: BABYLON.ParticleSystem = null;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.RangedWeapon");
        }

        public override attack(): void {
            const aimDir = new BABYLON.Vector3();
            const target = this.aimComp.getAimTarget(aimDir);
            
            this.damageGameObject(target, this.damage);
            
            if (this.bulletVfx) {
                this.bulletVfx.emitter.rotationQuaternion = BABYLON.Quaternion.FromLookDirectionLH(
                    aimDir, 
                    BABYLON.Vector3.Up()
                );
                
                this.bulletVfx.start();
            }
            
            this.playWeaponAudio();
        }
    }
}
