namespace PROJECT {
    export class Player extends TOOLKIT.ScriptComponent implements PROJECT.ITeamInterface {
        private moveStick: PROJECT.JoyStick;
        private aimStick: PROJECT.JoyStick;
        private characterController: TOOLKIT.CharacterController; 
        private moveSpeed: number = 20; 
        private maxMoveSpeed: number = 80; 
        private minMoveSpeed: number = 5; 
        private animTurnSpeed: number = 30;
        private movementComponent: PROJECT.MovementComponent;
        private teamID: number = 1;

        private inventoryComponent: PROJECT.InventoryComponent;
        private healthComponent: PROJECT.HealthComponent;
        private healthBar: PROJECT.PlayerValueGauge;
        private abilityComponent: PROJECT.AbilityComponent;
        private staminaBar: PROJECT.PlayerValueGauge;
        private uiManager: PROJECT.UIManager;
        
        private moveInput: BABYLON.Vector2 = new BABYLON.Vector2(0, 0);
        private aimInput: BABYLON.Vector2 = new BABYLON.Vector2(0, 0);
        
        private mainCam: BABYLON.Camera;
        private cameraController: PROJECT.CameraController;
        private animator: TOOLKIT.AnimationState;
        
        private animatorTurnSpeed: number = 0;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.Player") {
            super(transform, scene, properties, alias);
            
            if (properties.moveStick) this.moveStick = properties.moveStick;
            if (properties.aimStick) this.aimStick = properties.aimStick;
            if (properties.characterController) this.characterController = properties.characterController;
            if (properties.moveSpeed) this.moveSpeed = properties.moveSpeed;
            if (properties.maxMoveSpeed) this.maxMoveSpeed = properties.maxMoveSpeed;
            if (properties.minMoveSpeed) this.minMoveSpeed = properties.minMoveSpeed;
            if (properties.animTurnSpeed) this.animTurnSpeed = properties.animTurnSpeed;
            if (properties.movementComponent) this.movementComponent = properties.movementComponent;
            if (properties.teamID) this.teamID = properties.teamID;
            if (properties.inventoryComponent) this.inventoryComponent = properties.inventoryComponent;
            if (properties.healthComponent) this.healthComponent = properties.healthComponent;
            if (properties.healthBar) this.healthBar = properties.healthBar;
            if (properties.abilityComponent) this.abilityComponent = properties.abilityComponent;
            if (properties.staminaBar) this.staminaBar = properties.staminaBar;
            if (properties.uiManager) this.uiManager = properties.uiManager;
        }

        public addMoveSpeed(boostAmt: number): void {
            this.moveSpeed += boostAmt;
            this.moveSpeed = BABYLON.Scalar.Clamp(this.moveSpeed, this.minMoveSpeed, this.maxMoveSpeed);
        }

        public getTeamID(): number {
            return this.teamID;
        }

        protected start(): void {
            this.moveStick.onStickValueUpdated.push(this.moveStickUpdated.bind(this));
            this.aimStick.onStickValueUpdated.push(this.aimStickUpdated.bind(this));
            this.aimStick.onStickTaped.push(this.startSwichWeapon.bind(this));
            
            this.mainCam = this.scene.activeCamera;
            this.cameraController = TOOLKIT.SceneManager.SearchForScriptComponentByName(this.scene, "PROJECT.CameraController") as PROJECT.CameraController;
            this.animator = this.getComponent("TOOLKIT.AnimationState") as TOOLKIT.AnimationState;
            
            this.healthComponent.onHealthChange.push(this.healthChanged.bind(this));
            this.healthComponent.onHealthEmpty.push(this.startDeathSequence.bind(this));
            this.healthComponent.broadcastHealthValueImmeidately();
            
            this.abilityComponent.onStaminaChange.push(this.staminaChanged.bind(this));
            this.abilityComponent.broadcastStaminaChangeImmedietely();
            PROJECT.GameplayStatics.gameStarted();
        }

        private staminaChanged(newAmount: number, maxAmount: number): void {
            this.staminaBar.updateValue(newAmount, 0, maxAmount);
        }

        private startDeathSequence(killer: BABYLON.TransformNode): void {
            this.animator.setFloat("layerWeight2", 1);
            this.animator.setTrigger("Death");
            this.uiManager.setGameplayControlEnabled(false);
        }

        private healthChanged(health: number, delta: number, maxHealth: number): void {
            this.healthBar.updateValue(health, delta, maxHealth);
        }

        public attackPoint(): void {
            if (this.inventoryComponent.hasWeapon()) {
                this.inventoryComponent.getActiveWeapon().attack();
            }
        }

        private startSwichWeapon(): void {
            if (this.inventoryComponent.hasWeapon()) {
                this.animator.setTrigger("switchWeapon");
            }
        }

        public switchWeapon(): void {
            this.inventoryComponent.nextWeapon();
        }

        private aimStickUpdated(inputValue: BABYLON.Vector2): void {
            this.aimInput = inputValue;
            if (this.inventoryComponent.hasWeapon()) {
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
            
            this.characterController.move(moveDir.scale(this.getDeltaTime() * this.moveSpeed));
            
            this.updateAim(moveDir);
            
            const forward = BABYLON.Vector3.Dot(moveDir, this.transform.forward);
            const right = BABYLON.Vector3.Dot(moveDir, this.transform.right);
            
            this.animator.setFloat("forwardSpeed", forward);
            this.animator.setFloat("rightSpeed", right);
            
            this.characterController.move(BABYLON.Vector3.Down().scale(this.getDeltaTime() * 10));
        }

        private updateAim(currentMoveDir: BABYLON.Vector3): void {
            let aimDir = currentMoveDir;
            if (this.aimInput.length() != 0) {
                aimDir = this.stickInputToWorldDir(this.aimInput);
            }
            this.rotateTowards(aimDir);
        }

        private updateCamera(): void {
            if (this.moveInput.length() != 0 && this.aimInput.length() == 0 && this.cameraController != null) {
                this.cameraController.addYawInput(this.moveInput.x);
            }
        }

        private rotateTowards(aimDir: BABYLON.Vector3): void {
            const currentTurnSpeed = this.movementComponent.rotateTowards(aimDir);
            this.animatorTurnSpeed = BABYLON.Scalar.Lerp(this.animatorTurnSpeed, currentTurnSpeed, this.getDeltaTime() * this.animTurnSpeed);
            
            this.animator.setFloat("turnSpeed", this.animatorTurnSpeed);
            BABYLON.Tools.Log("TurnSpeed: " + this.animatorTurnSpeed);
        }

        public deathFinished(): void {
            this.uiManager.swithToDeathMenu();
        }
    }
}
