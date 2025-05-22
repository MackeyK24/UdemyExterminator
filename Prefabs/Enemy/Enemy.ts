namespace PROJECT {
    export abstract class Enemy extends TOOLKIT.ScriptComponent implements PROJECT.IBehaviorTreeInterface, PROJECT.ITeamInterface, PROJECT.ISpawnInterface {
        private healthComponent: PROJECT.HealthComponent;
        private animator: TOOLKIT.AnimationState;
        private perceptionComp: PROJECT.PerceptionComponent;
        private behaviorTree: PROJECT.BehaviorTree;
        private movementComponent: PROJECT.MovementComponent;
        private teamID: number = 2;
        private prevPos: BABYLON.Vector3;
        private killReward: PROJECT.Reward;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.Enemy") {
            super(transform, scene, properties, alias);
            
            if (properties.healthComponent) this.healthComponent = properties.healthComponent;
            if (properties.animator) this.animator = properties.animator;
            if (properties.perceptionComp) this.perceptionComp = properties.perceptionComp;
            if (properties.behaviorTree) this.behaviorTree = properties.behaviorTree;
            if (properties.movementComponent) this.movementComponent = properties.movementComponent;
            if (properties.teamID) this.teamID = properties.teamID;
            if (properties.killReward) this.killReward = properties.killReward;
        }

        public getTeamID(): number {
            return this.teamID;
        }

        public getAnimator(): TOOLKIT.AnimationState {
            return this.animator;
        }

        protected awake(): void {
            this.perceptionComp.onPerceptionTargetChanged.push(this.targetChanged.bind(this));
        }

        protected start(): void {
            if (this.healthComponent != null) {
                this.healthComponent.onHealthEmpty.push(this.startDeath.bind(this));
                this.healthComponent.onTakeDamage.push(this.takenDamage.bind(this));
            }
            this.prevPos = this.transform.position.clone();
        }

        private targetChanged(target: BABYLON.TransformNode, sensed: boolean): void {
            if (sensed) {
                this.behaviorTree.blackboard.setOrAddData("Target", target);
            } else {
                this.behaviorTree.blackboard.setOrAddData("LastSeenLoc", target.position);
                this.behaviorTree.blackboard.removeBlackboardData("Target");
            }
        }

        private takenDamage(health: number, delta: number, maxHealth: number, instigator: BABYLON.TransformNode): void {
        }

        private startDeath(killer: BABYLON.TransformNode): void {
            this.triggerDeathAnimation();
            this.behaviorTree.stopLogic();
            
            if (this.transform.physicsBody) {
                this.transform.physicsBody.isActive = false;
            }
            
            const rewardListeners = [];
            const components = TOOLKIT.SceneManager.FindScriptComponents(killer, "PROJECT.IRewardListener");
            for (let i = 0; i < components.length; i++) {
                const listener = components[i] as PROJECT.IRewardListener;
                listener.reward(this.killReward);
            }
        }

        private triggerDeathAnimation(): void {
            if (this.animator != null) {
                this.animator.setTrigger("Dead");
            }
        }

        public onDeathAnimationFinished(): void {
            this.dead();
            this.transform.dispose();
        }

        protected update(): void {
            this.calculateSpeed();
            if (this.transform.position.y < -100) {
                this.startDeath(this.transform);
                console.log("Enemy Dropped to oblivion");
            }
        }

        private calculateSpeed(): void {
            if (this.movementComponent == null) return;

            const posDelta = this.transform.position.subtract(this.prevPos);
            const speed = posDelta.length() / this.getDeltaTime();
            this.animator.setFloat("Speed", speed);
            this.prevPos = this.transform.position.clone();
        }

        public rotateTowards(target: BABYLON.TransformNode, verticalAim: boolean = false): void {
            const aimDir = target.position.subtract(this.transform.position);
            if (!verticalAim) {
                aimDir.y = 0;
            }
            aimDir.normalize();

            this.movementComponent.rotateTowards(aimDir);
        }

        public abstract attackTarget(target: BABYLON.TransformNode): void;

        public spawnedBy(spawnerGameobject: BABYLON.TransformNode): void {
            const spawnerBehaviorTree = TOOLKIT.SceneManager.FindScriptComponent(spawnerGameobject, "PROJECT.BehaviorTree") as PROJECT.BehaviorTree;
            if (spawnerBehaviorTree != null) {
                let spawnerTarget: BABYLON.TransformNode = null;
                if (spawnerBehaviorTree.blackboard.getBlackboardData("Target", (data) => { spawnerTarget = data; })) {
                    const targetStimuli = TOOLKIT.SceneManager.FindScriptComponent(spawnerTarget, "PROJECT.PerceptionStimuli") as PROJECT.PerceptionStimuli;
                    if (this.perceptionComp && targetStimuli) {
                        this.perceptionComp.assignPercievedStimui(targetStimuli);
                    }
                }
            }
        }

        protected dead(): void {
        }
    }
}
