/**
 * Player - Main player character controller
 */
namespace PROJECT {
    export class Player extends TOOLKIT.ScriptComponent implements PROJECT.ITeamInterface {
        private moveStick: PROJECT.JoyStick = null;
        private aimStick: PROJECT.JoyStick = null;
        private characterController: TOOLKIT.CharacterController = null;
        private moveSpeed: number = 20.0;
        private maxMoveSpeed: number = 80.0;
        private minMoveSpeed: number = 5.0;
        private animTurnSpeed: number = 30.0;
        private movementComponent: PROJECT.MovementComponent = null;
        private teamID: number = 1;
        
        private inventoryComponent: PROJECT.InventoryComponent = null;
        
        private healthComponent: PROJECT.HealthComponent = null;
        private healthBar: PROJECT.PlayerValueGauge = null;
        
        private abilityComponent: PROJECT.AbilityComponent = null;
        private staminaBar: PROJECT.PlayerValueGauge = null;
        
        private uiManager: PROJECT.UIManager = null;
        private moveInput: BABYLON.Vector2 = new BABYLON.Vector2(0, 0);
        private aimInput: BABYLON.Vector2 = new BABYLON.Vector2(0, 0);
        
        private mainCam: BABYLON.Camera = null;
        private cameraController: PROJECT.CameraController = null;
        private animator: TOOLKIT.AnimationState = null;
        
        private animatorTurnSpeed: number = 0;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.Player");
        }
        
        public getTeamID(): number {
            return this.teamID;
        }
        
        protected start(): void {
            if (this.moveStick) {
                this.moveStick.registerOnStickValueUpdated(this.moveStickUpdated.bind(this));
            }
            
            if (this.aimStick) {
                this.aimStick.registerOnStickValueUpdated(this.aimStickUpdated.bind(this));
                this.aimStick.registerOnStickTaped(this.startSwichWeapon.bind(this));
            }
            
            this.mainCam = this.scene.activeCamera;
            
            this.cameraController = TOOLKIT.SceneManager.FindScriptComponent(
                null, 
                "PROJECT.CameraController"
            ) as PROJECT.CameraController;
            
            this.animator = this.getComponent("TOOLKIT.AnimationState") as TOOLKIT.AnimationState;
            
            if (this.healthComponent) {
                this.healthComponent.registerOnHealthChange(this.healthChanged.bind(this));
                this.healthComponent.registerOnHealthEmpty(this.startDeathSequence.bind(this));
                this.healthComponent.broadcastHealthValueImmeidately();
            }
            
            if (this.abilityComponent) {
                this.abilityComponent.registerOnStaminaChange(this.staminaChanged.bind(this));
                this.abilityComponent.broadcastStaminaChangeImmedietely();
            }
            
            PROJECT.GameplayStatics.gameStarted();
        }
        
        public addMoveSpeed(boostAmt: number): void {
            this.moveSpeed += boostAmt;
            this.moveSpeed = Math.max(this.minMoveSpeed, Math.min(this.moveSpeed, this.maxMoveSpeed));
        }
        
        private staminaChanged(newAmount: number, maxAmount: number): void {
            if (this.staminaBar) {
                this.staminaBar.updateValue(newAmount, 0, maxAmount);
            }
        }
        
        private startDeathSequence(killer: BABYLON.TransformNode): void {
            if (this.animator) {
                this.animator.setFloat("LayerWeight2", 1);
                this.animator.setTrigger("Death");
            }
            
            if (this.uiManager) {
                this.uiManager.setGameplayControlEnabled(false);
            }
        }
        
        private healthChanged(health: number, delta: number, maxHealth: number): void {
            if (this.healthBar) {
                this.healthBar.updateValue(health, delta, maxHealth);
            }
        }
        
        public attackPoint(): void {
            if (this.inventoryComponent && this.inventoryComponent.hasWeapon()) {
                const weapon = this.inventoryComponent.getActiveWeapon();
                if (weapon) {
                    weapon.attack();
                }
            }
        }
        
        private startSwichWeapon(): void {
            if (this.inventoryComponent && this.inventoryComponent.hasWeapon() && this.animator) {
                this.animator.setTrigger("switchWeapon");
            }
        }
        
        public switchWeapon(): void {
            if (this.inventoryComponent) {
                this.inventoryComponent.nextWeapon();
            }
        }
        
        private aimStickUpdated(inputValue: BABYLON.Vector2): void {
            this.aimInput = inputValue;
            
            if (this.inventoryComponent && this.inventoryComponent.hasWeapon() && this.animator) {
                if (this.aimInput.length() > 0) {
                    this.animator.setBool("attacking", true);
                } else {
                    this.animator.setBool("attacking", false);
                }
            }
        }
        
        private moveStickUpdated(inputValue: BABYLON.Vector2): void {
            this.moveInput = inputValue;
        }
        
        private stickInputToWorldDir(inputVal: BABYLON.Vector2): BABYLON.Vector3 {
            if (!this.mainCam) return BABYLON.Vector3.Zero();
            
            const rightDir = this.mainCam.getDirection(BABYLON.Vector3.Right());
            const upDir = BABYLON.Vector3.Cross(rightDir, BABYLON.Vector3.Up());
            
            return rightDir.scale(inputVal.x).add(upDir.scale(inputVal.y));
        }
        
        protected update(): void {
            this.performMoveAndAim();
            this.updateCamera();
        }
        
        private performMoveAndAim(): void {
            const moveDir = this.stickInputToWorldDir(this.moveInput);
            
            if (this.characterController) {
                this.characterController.move(moveDir.scale(this.moveSpeed * this.getDeltaTime()));
            }
            
            this.updateAim(moveDir);
            
            if (this.animator) {
                const forward = BABYLON.Vector3.Dot(moveDir, this.transform.forward);
                const right = BABYLON.Vector3.Dot(moveDir, this.transform.right);
                
                this.animator.setFloat("forwardSpeed", forward);
                this.animator.setFloat("rightSpeed", right);
            }
            
            if (this.characterController) {
                this.characterController.move(BABYLON.Vector3.Down().scale(10.0 * this.getDeltaTime()));
            }
        }
        
        private updateAim(currentMoveDir: BABYLON.Vector3): void {
            let aimDir = currentMoveDir;
            
            if (this.aimInput.length() !== 0) {
                aimDir = this.stickInputToWorldDir(this.aimInput);
            }
            
            this.rotateTowards(aimDir);
        }
        
        private updateCamera(): void {
            if (this.moveInput.length() !== 0 && this.aimInput.length() === 0 && this.cameraController) {
                this.cameraController.addYawInput(this.moveInput.x);
            }
        }
        
        private rotateTowards(aimDir: BABYLON.Vector3): void {
            if (!this.movementComponent) return;
            
            const currentTurnSpeed = this.movementComponent.rotateTowards(aimDir);
            this.animatorTurnSpeed = BABYLON.Scalar.Lerp(
                this.animatorTurnSpeed, 
                currentTurnSpeed, 
                this.getDeltaTime() * this.animTurnSpeed
            );
            
            if (this.animator) {
                this.animator.setFloat("turnSpeed", this.animatorTurnSpeed);
            }
        }
        
        public deathFinished(): void {
            if (this.uiManager) {
                this.uiManager.switchToDeathMenu();
            }
        }
    }
}
