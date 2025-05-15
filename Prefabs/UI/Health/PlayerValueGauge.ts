/**
 * PlayerValueGauge - UI component for displaying player health/value
 */
namespace PROJECT {
    export class PlayerValueGauge extends TOOLKIT.ScriptComponent {
        private amtImage: BABYLON.GUI.Image = null;
        private amtText: BABYLON.GUI.TextBlock = null;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.PlayerValueGauge");
        }

        public updateValue(health: number, delta: number, maxHealth: number): void {
            if (this.amtImage) {
                this.amtImage.width = `${(health / maxHealth) * 100}%`;
            }
            
            if (this.amtText) {
                const healthAsInt: number = Math.max(0, Math.floor(health));
                this.amtText.text = healthAsInt.toString();
            }
        }
    }
}
