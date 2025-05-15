/**
 * EnemyCounter - Tracks the number of enemies in the level
 */
namespace PROJECT {
    export class EnemyCounter extends TOOLKIT.ScriptComponent {
        private static enemyCount: number = 0;
        private static enemyCountUpdatedCallbacks: ((newCount: number) => void)[] = [];
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.EnemyCounter");
        }
        
        protected start(): void {
            PROJECT.EnemyCounter.enemyCount++;
            
            this.invokeEnemyCountUpdated();
        }
        
        protected onDestroy(): void {
            PROJECT.EnemyCounter.enemyCount--;
            
            this.invokeEnemyCountUpdated();
            
            if (PROJECT.EnemyCounter.enemyCount <= 0) {
                const levelManager = TOOLKIT.SceneManager.FindScriptComponent(
                    null, 
                    "PROJECT.LevelManager"
                ) as PROJECT.LevelManager;
                
                if (levelManager) {
                    levelManager.levelFinished();
                }
            }
        }
        
        private invokeEnemyCountUpdated(): void {
            for (const callback of PROJECT.EnemyCounter.enemyCountUpdatedCallbacks) {
                callback(PROJECT.EnemyCounter.enemyCount);
            }
        }
        
        public static registerEnemyCountUpdated(callback: (newCount: number) => void): void {
            PROJECT.EnemyCounter.enemyCountUpdatedCallbacks.push(callback);
        }
    }
}
