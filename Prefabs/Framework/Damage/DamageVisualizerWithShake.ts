namespace PROJECT {
    export class DamageVisualizerWithShake extends PROJECT.DamageVisualiser {
        private shaker: PROJECT.Shaker;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.DamageVisualizerWithShake") {
            super(transform, scene, properties, alias);
            
            if (properties.shaker) this.shaker = properties.shaker;
        }

        protected tookDamage(health: number, delta: number, maxHealth: number, instigator: BABYLON.TransformNode): void {
            super.tookDamage(health, delta, maxHealth, instigator);
            
            if (this.shaker != null) {
                this.shaker.startShake();
            }
        }
    }
}
