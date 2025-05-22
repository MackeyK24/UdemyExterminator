namespace PROJECT {
    export class HealthComponent extends TOOLKIT.ScriptComponent implements PROJECT.IRewardListener {
        private health: number = 100;
        private maxhealth: number = 100;
        
        public onHealthChange: ((health: number, delta: number, maxHealth: number) => void)[] = [];
        public onTakeDamage: ((health: number, delta: number, maxHealth: number, instigator: BABYLON.TransformNode) => void)[] = [];
        public onHealthEmpty: ((killer: BABYLON.TransformNode) => void)[] = [];
        
        private hitAudio: string;
        private deathAudio: string;
        private volume: number;
        private audioSrc: TOOLKIT.AudioSource;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.HealthComponent") {
            super(transform, scene, properties, alias);
        }
        
        protected awake(): void {
            this.audioSrc = this.getComponent("TOOLKIT.AudioSource") as TOOLKIT.AudioSource;
        }
        
        public broadcastHealthValueImmeidately(): void {
            for (const callback of this.onHealthChange) {
                callback(this.health, 0, this.maxhealth);
            }
        }
        
        public changeHealth(amt: number, instigator: BABYLON.TransformNode): void {
            if (amt == 0 || this.health == 0) {
                return;
            }
            
            this.health += amt;
            
            if (amt < 0) {
                for (const callback of this.onTakeDamage) {
                    callback(this.health, amt, this.maxhealth, instigator);
                }
                
                const loc = this.transform.position;
                if (this.audioSrc && !this.audioSrc.isPaused()) {
                    this.audioSrc.play(this.hitAudio, null, null, this.volume);
                }
            }
            
            for (const callback of this.onHealthChange) {
                callback(this.health, amt, this.maxhealth);
            }
            
            if (this.health <= 0) {
                this.health = 0;
                
                for (const callback of this.onHealthEmpty) {
                    callback(instigator);
                }
                
                const loc = this.transform.position;
                PROJECT.GameplayStatics.playAudioAtLoc(this.deathAudio, loc, 1);
            }
        }
        
        public reward(reward: PROJECT.Reward): void {
            this.health = Math.min(Math.max(this.health + reward.healthReward, 0), this.maxhealth);
            
            for (const callback of this.onHealthChange) {
                callback(this.health, reward.healthReward, this.maxhealth);
            }
        }
    }
}
