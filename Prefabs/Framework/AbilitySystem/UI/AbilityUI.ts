/**
 * AbilityUI - UI component for displaying and managing ability icons with cooldown visualization
 */
namespace PROJECT {
    export class AbilityUI extends TOOLKIT.ScriptComponent {
        private ability: PROJECT.Ability = null;
        private abilityIcon: BABYLON.GUI.Image = null;
        private cooldownWheel: BABYLON.GUI.Image = null;
        
        private highlightSize: number = 1.5;
        private heightOffset: number = 200.0;
        private scaleSpeed: number = 20.0;
        private offsetPivot: BABYLON.GUI.Control = null;
        
        private goalScale: BABYLON.Vector3 = BABYLON.Vector3.One();
        private goalOffset: BABYLON.Vector3 = BABYLON.Vector3.Zero();
        
        private bIsOnCooldown: boolean = false;
        private cooldownCounter: number = 0.0;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.AbilityUI");
        }
        
        public setScaleAmt(amt: number): void {
            this.goalScale = BABYLON.Vector3.One().scale(1 + (this.highlightSize - 1) * amt);
            this.goalOffset = BABYLON.Vector3.Left().scale(this.heightOffset * amt);
        }
        
        protected start(): void {
        }
        
        protected update(): void {
            this.transform.scaling = BABYLON.Vector3.Lerp(
                this.transform.scaling, 
                this.goalScale, 
                this.getDeltaTime() * this.scaleSpeed
            );
            
            if (this.offsetPivot) {
                const currentPos = this.offsetPivot.position || BABYLON.Vector3.Zero();
                const newPos = BABYLON.Vector3.Lerp(
                    currentPos, 
                    this.goalOffset, 
                    this.getDeltaTime() * this.scaleSpeed
                );
                this.offsetPivot.position = newPos;
            }
        }
        
        public init(newAbility: PROJECT.Ability): void {
            this.ability = newAbility;
            
            if (this.abilityIcon && newAbility) {
                const iconTexture = newAbility.getAbilityIcon();
                if (iconTexture) {
                    this.abilityIcon.source = iconTexture;
                }
            }
            
            if (this.cooldownWheel) {
                this.cooldownWheel.isVisible = false;
            }
            
            if (this.ability) {
                this.ability.onCooldownStartedCallbacks.push(this.startCooldown.bind(this));
            }
        }
        
        private startCooldown(): void {
            if (this.bIsOnCooldown) return;
            
            this.startCooldownAnimation();
        }
        
        public activateAbility(): void {
            if (this.ability) {
                this.ability.activateAbility();
            }
        }
        
        private startCooldownAnimation(): void {
            this.bIsOnCooldown = true;
            this.cooldownCounter = this.ability ? this.ability.getCooldownDuration() : 0;
            const cooldownDuration = this.cooldownCounter;
            
            if (this.cooldownWheel) {
                this.cooldownWheel.isVisible = true;
            }
            
            const observer = this.scene.onBeforeRenderObservable.add(() => {
                if (this.cooldownCounter > 0) {
                    this.cooldownCounter -= this.getDeltaTime();
                    
                    if (this.cooldownWheel) {
                        this.cooldownWheel.levelVisible = this.cooldownCounter / cooldownDuration;
                    }
                } else {
                    this.bIsOnCooldown = false;
                    
                    if (this.cooldownWheel) {
                        this.cooldownWheel.isVisible = false;
                    }
                    
                    this.scene.onBeforeRenderObservable.remove(observer);
                }
            });
        }
    }
}
