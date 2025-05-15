/**
 * Reward - Data structure for various reward types and interface for reward recipients
 */
namespace PROJECT {
    export class Reward {
        public healthReward: number = 0;
        public creditReward: number = 0;
        public staminaReward: number = 0;
        
        constructor(healthReward: number = 0, creditReward: number = 0, staminaReward: number = 0) {
            this.healthReward = healthReward;
            this.creditReward = creditReward;
            this.staminaReward = staminaReward;
        }
    }
    
    export interface IRewardListener {
        reward(reward: PROJECT.Reward): void;
    }
}
