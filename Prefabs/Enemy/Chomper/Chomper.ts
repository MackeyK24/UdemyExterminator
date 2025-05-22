namespace PROJECT {
    export class Chomper extends PROJECT.Enemy {
        private damageComponent: PROJECT.TriggerDamageComponent;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.Chomper") {
            super(transform, scene, properties, alias);
            
            if (properties.damageComponent) this.damageComponent = properties.damageComponent;
        }

        public attackTarget(target: BABYLON.TransformNode): void {
            this.getAnimator().setTrigger("Attack");
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

        protected start(): void {
            super.start();
            this.damageComponent.setTeamInterfaceSrc(this);
        }
    }
}
