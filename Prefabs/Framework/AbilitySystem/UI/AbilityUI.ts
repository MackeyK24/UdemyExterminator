namespace PROJECT {
    export class AbilityUI extends TOOLKIT.ScriptComponent {
        private ability: PROJECT.Ability;
        private abilityIcon: BABYLON.GUI.Image;
        private cooldownWheel: BABYLON.GUI.Image;
        
        private highlightSize: number = 1.5;
        private hightOffset: number = 200.0;
        private scaleSpeed: number = 20.0;
        private offsetPivot: BABYLON.GUI.Control;
        
        private goalScale: BABYLON.Vector3 = BABYLON.Vector3.One();
        private goalOffset: BABYLON.Vector3 = BABYLON.Vector3.Zero();
        
        private bIsOnCooldown: boolean = false;
        private cooldownCounter: number = 0.0;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.AbilityUI") {
            super(transform, scene, properties, alias);
        }
        
        public setScaleAmt(amt: number): void {
            this.goalScale = BABYLON.Vector3.One().scale(1 + (this.highlightSize - 1) * amt);
            this.goalOffset = BABYLON.Vector3.Left().scale(this.hightOffset * amt);
        }
        
        protected update(): void {
            const dt = this.getDeltaTime();
            this.transform.scaling = BABYLON.Vector3.Lerp(this.transform.scaling, this.goalScale, dt * this.scaleSpeed);
            
            if (this.offsetPivot) {
                const currentPos = new BABYLON.Vector3(this.offsetPivot.leftInPixels, this.offsetPivot.topInPixels, 0);
                const newPos = BABYLON.Vector3.Lerp(currentPos, this.goalOffset, dt * this.scaleSpeed);
                this.offsetPivot.leftInPixels = newPos.x;
                this.offsetPivot.topInPixels = newPos.y;
            }
        }
        
        public init(newAbility: PROJECT.Ability): void {
            this.ability = newAbility;
            this.abilityIcon.source = newAbility.getAbilityIcon();
            this.cooldownWheel.isVisible = false;
            this.ability.onCooldownStarted.push(this.startCooldown.bind(this));
        }
        
        private startCooldown(): void {
            if (this.bIsOnCooldown) return;
            
            this.cooldownCoroutine();
        }
        
        public activateAbility(): void {
            this.ability.activateAbility();
        }
        
        private cooldownCoroutine(): void {
            this.bIsOnCooldown = true;
            this.cooldownCounter = this.ability.getCooldownDuration();
            const cooldownDuration = this.cooldownCounter;
            this.cooldownWheel.isVisible = true;
            
            const intervalId = window.setInterval(() => {
                this.cooldownCounter -= this.getDeltaTime();
                
                if (this.cooldownWheel) {
                    const fillAmount = this.cooldownCounter / cooldownDuration;
                    this.cooldownWheel.width = `${fillAmount * 100}%`;
                }
                
                if (this.cooldownCounter <= 0) {
                    window.clearInterval(intervalId);
                    this.bIsOnCooldown = false;
                    this.cooldownWheel.isVisible = false;
                }
            }, 0); // Run every frame
        }
    }
}
