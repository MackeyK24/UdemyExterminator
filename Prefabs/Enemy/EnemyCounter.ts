namespace PROJECT {
    export class EnemyCounter extends TOOLKIT.ScriptComponent {
        private static enemyCount: number = 0;
        public static onEnemyCountUpdated: ((newCount: number) => void)[] = [];
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.EnemyCounter") {
            super(transform, scene, properties, alias);
        }
        
        protected start(): void {
            ++PROJECT.EnemyCounter.enemyCount;
            this.invokeEnemyCountUpdated();
        }
        
        private invokeEnemyCountUpdated(): void {
            if (PROJECT.EnemyCounter.onEnemyCountUpdated.length > 0) {
                for (const callback of PROJECT.EnemyCounter.onEnemyCountUpdated) {
                    callback(PROJECT.EnemyCounter.enemyCount);
                }
            }
        }
        
        public onDestroy(): void {
            --PROJECT.EnemyCounter.enemyCount;
            this.invokeEnemyCountUpdated();
            
            if (PROJECT.EnemyCounter.enemyCount <= 0) {
                PROJECT.LevelManager.levelFinished();
            }
        }
    }
}
