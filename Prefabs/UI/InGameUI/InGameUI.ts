/**
 * InGameUI - Manages in-game user interface elements
 */
namespace PROJECT {
    export class InGameUI extends TOOLKIT.ScriptComponent {
        private amtText: BABYLON.GUI.TextBlock = null;
        private enemyCountUpdatedCallbacks: ((enemyCount: number) => void)[] = [];

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.InGameUI");
        }

        protected awake(): void {
            const enemyCounter = TOOLKIT.SceneManager.FindScriptComponent(null, "PROJECT.EnemyCounter") as PROJECT.EnemyCounter;
            if (enemyCounter) {
                enemyCounter.registerEnemyCountUpdated(this.updateEnemyCount.bind(this));
            }
        }

        private updateEnemyCount(enemyCount: number): void {
            if (this.amtText) {
                this.amtText.text = enemyCount.toString();
            }
        }
    }
}
