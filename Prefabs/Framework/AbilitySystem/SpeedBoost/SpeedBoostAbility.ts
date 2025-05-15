/**
 * SpeedBoostAbility - Ability that temporarily increases player movement speed
 */
namespace PROJECT {
    export class SpeedBoostAbility extends PROJECT.Ability {
        private boostAmt: number = 20.0;
        private boostDuration: number = 2.0;
        private player: PROJECT.Player = null;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.SpeedBoostAbility");
        }
        
        public activateAbility(): void {
            if (!this.commitAbility()) return;
            
            this.player = this.abilityComp.getComponent("PROJECT.Player") as PROJECT.Player;
            this.player.addMoveSpeed(this.boostAmt);
            
            const observer = this.scene.onBeforeRenderObservable.add(() => {
            });
            
            setTimeout(() => {
                this.scene.onBeforeRenderObservable.remove(observer);
                this.player.addMoveSpeed(-this.boostAmt);
            }, this.boostDuration * 1000); // Convert seconds to milliseconds
        }
    }
}
