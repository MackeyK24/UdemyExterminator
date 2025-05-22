namespace PROJECT {
    export class Reward extends TOOLKIT.ScriptComponent {
        public healthReward: number = 0;
        public creditReward: number = 0;
        public staminaReward: number = 0;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.Reward") {
            super(transform, scene, properties, alias);
        }
    }
    
    export interface IRewardListener {
        reward?: (reward: PROJECT.Reward) => void;
    }
}
