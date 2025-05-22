namespace PROJECT {
    export class RangedWeapon extends PROJECT.Weapon {
        private aimComp: PROJECT.AimComponent;
        private damage: number = 5;
        private bulletVfx: BABYLON.ParticleSystem;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.RangedWeapon") {
            super(transform, scene, properties, alias);
            
            if (properties.aimComp) this.aimComp = properties.aimComp;
            if (properties.damage) this.damage = properties.damage;
            if (properties.bulletVfx) this.bulletVfx = properties.bulletVfx;
        }

        public override attack(): void {
            const aimDir = new BABYLON.Vector3();
            const target = this.aimComp.getAimTarget(aimDir);
            this.damageGameObject(target, this.damage);

            const quaternion = BABYLON.Quaternion.FromLookDirectionLH(aimDir, BABYLON.Vector3.Up());
            this.bulletVfx.emitter.rotationQuaternion = quaternion;
            
            this.bulletVfx.start();
            
            this.playWeaponAudio();
        }
    }
}
