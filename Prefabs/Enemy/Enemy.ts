namespace PROJECT {
    export interface ITeamInterface {
        getTeamID?: () => number;
    }
    
    export interface ISpawnInterface {
        spawnedBy?: (spawnerGameobject: BABYLON.TransformNode) => void;
    }
    
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
        }
        
        public getTeamID(): number {
            return this.teamID;
        }
        
        public get animatorComponent(): TOOLKIT.AnimationState {
            return this.animator;
        }
        
        protected awake(): void {
            this.perceptionComp = this.getComponent("PROJECT.PerceptionComponent") as PROJECT.PerceptionComponent;
            if (this.perceptionComp) {
                this.perceptionComp.onPerceptionTargetChanged.push(this.targetChanged.bind(this));
            }
        }
        
        protected start(): void {
            this.healthComponent = this.getComponent("PROJECT.HealthComponent") as PROJECT.HealthComponent;
            if (this.healthComponent) {
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
            
            const rewardListeners = TOOLKIT.SceneManager.FindScriptComponents(killer, "PROJECT.IRewardListener") as PROJECT.IRewardListener[];
            
            for (const listener of rewardListeners) {
                if (listener.reward) {
                    listener.reward(this.killReward);
                }
            }
        }
        
        private triggerDeathAnimation(): void {
            if (this.animator) {
                this.animator.setTrigger("Dead");
            }
        }
        
        public onDeathAnimationFinished(): void {
            this.dead();
            TOOLKIT.SceneManager.DestroyTransformNode(this.transform);
        }
        
        protected update(): void {
            this.calculateSpeed();
            
            if (this.transform.position.y < -100) {
                this.startDeath(this.transform);
                console.log("Enemy Dropped to oblivion");
            }
        }
        
        private calculateSpeed(): void {
            if (!this.movementComponent) return;
            
            const posDelta = BABYLON.Vector3.Subtract(this.transform.position, this.prevPos);
            const speed = posDelta.length() / this.getDeltaTime();
            
            if (this.animator) {
                this.animator.setFloat("Speed", speed);
            }
            
            this.prevPos = this.transform.position.clone();
        }
        
        public rotateTowards(target: BABYLON.TransformNode, verticalAim: boolean = false): void {
            const aimDir = BABYLON.Vector3.Subtract(target.position, this.transform.position);
            
            if (!verticalAim) {
                aimDir.y = 0;
            }
            
            aimDir.normalize();
            
            this.movementComponent.rotateTowards(aimDir);
        }
        
        public abstract attackTarget(target: BABYLON.TransformNode): void;
        
        public spawnedBy(spawnerGameobject: BABYLON.TransformNode): void {
            const spawnerBehaviorTree = TOOLKIT.SceneManager.FindScriptComponent(spawnerGameobject, "PROJECT.BehaviorTree") as PROJECT.BehaviorTree;
            
            if (spawnerBehaviorTree) {
                let spawnerTarget: BABYLON.TransformNode = null;
                spawnerBehaviorTree.blackboard.getBlackboardData("Target", (value: any) => {
                    spawnerTarget = value;
                });
                
                if (spawnerTarget) {
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
