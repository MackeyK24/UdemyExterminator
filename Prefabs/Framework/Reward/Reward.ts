namespace PROJECT {
    export class Reward {
        public healthReward: number;
        public creditReward: number;
        public staminaReward: number;
        
        constructor(properties: any = {}) {
            if (properties.healthReward) this.healthReward = properties.healthReward;
            if (properties.creditReward) this.creditReward = properties.creditReward;
            if (properties.staminaReward) this.staminaReward = properties.staminaReward;
        }
    }
    
    export interface IRewardListener {
        reward?: (reward: PROJECT.Reward) => void;
    }
}
