/**
 * DamageVisualizerWithShake - Extends DamageVisualiser to add camera shake on damage
 */
namespace PROJECT {
    export class DamageVisualizerWithShake extends PROJECT.DamageVisualiser {
        private shaker: PROJECT.Shaker = null;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.DamageVisualizerWithShake");
        }
        
        protected tookDamage(health: number, delta: number, maxHealth: number, instigator: BABYLON.TransformNode): void {
            super.tookDamage(health, delta, maxHealth, instigator);
            
            if (this.shaker) {
                this.shaker.startShake();
            }
        }
    }
}
