/**
 * HealthComponent - Manages health, damage, and related events
 */
namespace PROJECT {
    export class HealthComponent extends TOOLKIT.ScriptComponent implements PROJECT.IRewardListener {
        private health: number = 100;
        private maxHealth: number = 100;
        
        private hitAudio: BABYLON.Sound = null;
        private deathAudio: BABYLON.Sound = null;
        private volume: number = 1.0;
        private audioSource: TOOLKIT.AudioSource = null;
        
        private onHealthChangeCallbacks: ((health: number, delta: number, maxHealth: number) => void)[] = [];
        private onTakeDamageCallbacks: ((health: number, delta: number, maxHealth: number, instigator: BABYLON.TransformNode) => void)[] = [];
        private onHealthEmptyCallbacks: ((killer: BABYLON.TransformNode) => void)[] = [];
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.HealthComponent");
        }
        
        protected awake(): void {
            this.audioSource = this.getComponent("TOOLKIT.AudioSource") as TOOLKIT.AudioSource;
        }
        
        public broadcastHealthValueImmediately(): void {
            for (const callback of this.onHealthChangeCallbacks) {
                callback(this.health, 0, this.maxHealth);
            }
        }
        
        public changeHealth(amount: number, instigator: BABYLON.TransformNode): void {
            if (amount === 0 || this.health === 0) {
                return;
            }
            
            this.health += amount;
            
            if (amount < 0) {
                for (const callback of this.onTakeDamageCallbacks) {
                    callback(this.health, amount, this.maxHealth, instigator);
                }
                
                const position = this.transform.position.clone();
                
                if (this.audioSource && this.hitAudio && !this.audioSource.isPaused()) {
                    this.audioSource.play(this.hitAudio, 0, 0, this.volume);
                }
            }
            
            for (const callback of this.onHealthChangeCallbacks) {
                callback(this.health, amount, this.maxHealth);
            }
            
            if (this.health <= 0) {
                this.health = 0;
                
                for (const callback of this.onHealthEmptyCallbacks) {
                    callback(instigator);
                }
                
                const position = this.transform.position.clone();
                PROJECT.GameplayStatics.playAudioAtLoc(this.deathAudio, position, 1);
            }
        }
        
        public reward(reward: PROJECT.Reward): void {
            const oldHealth = this.health;
            this.health = Math.max(0, Math.min(this.health + reward.healthReward, this.maxHealth));
            
            for (const callback of this.onHealthChangeCallbacks) {
                callback(this.health, reward.healthReward, this.maxHealth);
            }
        }
        
        public registerOnHealthChange(callback: (health: number, delta: number, maxHealth: number) => void): void {
            this.onHealthChangeCallbacks.push(callback);
        }
        
        public registerOnTakeDamage(callback: (health: number, delta: number, maxHealth: number, instigator: BABYLON.TransformNode) => void): void {
            this.onTakeDamageCallbacks.push(callback);
        }
        
        public registerOnHealthEmpty(callback: (killer: BABYLON.TransformNode) => void): void {
            this.onHealthEmptyCallbacks.push(callback);
        }
    }
}
