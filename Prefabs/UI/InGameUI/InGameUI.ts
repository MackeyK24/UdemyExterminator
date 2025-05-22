namespace PROJECT {
    export class InGameUI extends TOOLKIT.ScriptComponent {
        private amtText: BABYLON.GUI.TextBlock;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.InGameUI") {
            super(transform, scene, properties, alias);
            
            if (properties.amtText) this.amtText = properties.amtText;
        }

        protected awake(): void {
            PROJECT.EnemyCounter.enemyCountUpdated.push(this.updateEnemyCount.bind(this));
        }

        private updateEnemyCount(enemyCount: number): void {
            this.amtText.text = enemyCount.toString();
        }
    }
}
