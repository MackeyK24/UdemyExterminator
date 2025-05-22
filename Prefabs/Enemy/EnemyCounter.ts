namespace PROJECT {
    export class EnemyCounter extends TOOLKIT.ScriptComponent {
        private static enemyCount: number = 0;
        public static enemyCountUpdated: ((newCount: number) => void)[] = [];
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.EnemyCounter") {
            super(transform, scene, properties, alias);
        }
        
        protected start(): void {
            ++EnemyCounter.enemyCount;
            
            for (let i = 0; i < EnemyCounter.enemyCountUpdated.length; i++) {
                EnemyCounter.enemyCountUpdated[i](EnemyCounter.enemyCount);
            }
        }
        
        protected onDestroy(): void {
            --EnemyCounter.enemyCount;
            
            for (let i = 0; i < EnemyCounter.enemyCountUpdated.length; i++) {
                EnemyCounter.enemyCountUpdated[i](EnemyCounter.enemyCount);
            }
            
            if (EnemyCounter.enemyCount <= 0) {
                PROJECT.LevelManager.levelFinished();
            }
        }
    }
}
