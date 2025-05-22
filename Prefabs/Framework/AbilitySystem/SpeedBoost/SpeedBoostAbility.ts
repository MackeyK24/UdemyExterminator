namespace PROJECT {
    export class SpeedBoostAbility extends PROJECT.Ability {
        private boostAmt: number = 20.0;
        private boostDuration: number = 2.0;
        
        private player: PROJECT.Player;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.SpeedBoostAbility") {
            super(transform, scene, properties, alias);
            
            if (properties.boostAmt) this.boostAmt = properties.boostAmt;
            if (properties.boostDuration) this.boostDuration = properties.boostDuration;
        }
        
        public activateAbility(): void {
            if (!this.commitAbility()) return;
            
            this.player = this.abilityComp.getComponent("PROJECT.Player") as PROJECT.Player;
            this.player.addMoveSpeed(this.boostAmt);
            
            setTimeout(() => {
                this.player.addMoveSpeed(-this.boostAmt);
            }, this.boostDuration * 1000);
        }
    }
}
