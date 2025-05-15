/**
 * Enemy - Abstract base class for enemy entities
 */
namespace PROJECT {
    export abstract class Enemy extends TOOLKIT.ScriptComponent implements PROJECT.IBehaviorTreeInterface, PROJECT.ITeamInterface, PROJECT.ISpawnInterface {
        private healthComponent: PROJECT.HealthComponent = null;
        private animator: TOOLKIT.AnimationState = null;
        private perceptionComp: PROJECT.PerceptionComponent = null;
        private behaviorTree: PROJECT.BehaviorTree = null;
        private movementComponent: PROJECT.MovementComponent = null;
        private teamID: number = 2;
        
        private prevPos: BABYLON.Vector3 = null;
        private killReward: PROJECT.Reward = null;
        private onPerceptionTargetChangedCallback: (target: BABYLON.TransformNode, sensed: boolean) => void = null;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.Enemy");
        }
        
        public getTeamID(): number {
            return this.teamID;
        }
        
        protected awake(): void {
            if (this.perceptionComp) {
                this.onPerceptionTargetChangedCallback = this.targetChanged.bind(this);
                this.perceptionComp.onPerceptionTargetChangedCallbacks.push(this.onPerceptionTargetChangedCallback);
            }
        }
        
        protected start(): void {
            if (this.healthComponent) {
                this.healthComponent.onHealthEmptyCallbacks.push(this.startDeath.bind(this));
                this.healthComponent.onTakeDamageCallbacks.push(this.takenDamage.bind(this));
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
            
            const rewardListeners = killer.getComponents("PROJECT.IRewardListener") as PROJECT.IRewardListener[];
            for (const listener of rewardListeners) {
                listener.reward(this.killReward);
            }
        }
        
        private triggerDeathAnimation(): void {
            if (this.animator) {
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
            if (!this.movementComponent || !this.animator) return;
            
            const posDelta = BABYLON.Vector3.Distance(this.transform.position, this.prevPos);
            const speed = posDelta / this.getDeltaTime();
            this.animator.setFloat("Speed", speed);
            this.prevPos = this.transform.position.clone();
        }
        
        public rotateTowards(target: BABYLON.TransformNode, verticalAim: boolean = false): void {
            if (!this.movementComponent) return;
            
            let aimDir = target.position.subtract(this.transform.position);
            if (!verticalAim) {
                aimDir.y = 0;
            }
            aimDir = aimDir.normalize();
            
            this.movementComponent.rotateTowards(aimDir);
        }
        
        public abstract attackTarget(target: BABYLON.TransformNode): void;
        
        public spawnedBy(spawnerGameObject: BABYLON.TransformNode): void {
            const spawnerBehaviorTree = spawnerGameObject.getComponent("PROJECT.BehaviorTree") as PROJECT.BehaviorTree;
            if (spawnerBehaviorTree && spawnerBehaviorTree.blackboard) {
                const spawnerTarget = spawnerBehaviorTree.blackboard.getBlackboardData("Target") as BABYLON.TransformNode;
                if (spawnerTarget) {
                    const targetStimuli = spawnerTarget.getComponent("PROJECT.PerceptionStimuli") as PROJECT.PerceptionStimuli;
                    if (this.perceptionComp && targetStimuli) {
                        this.perceptionComp.assignPerceivedStimuli(targetStimuli);
                    }
                }
            }
        }
        
        protected dead(): void {
        }
        
        public getRelationTowards(other: BABYLON.TransformNode): PROJECT.ETeamRelation {
            return PROJECT.TeamInterfaceHelper.getDefaultRelationTowards(this.transform, other);
        }
    }
}
