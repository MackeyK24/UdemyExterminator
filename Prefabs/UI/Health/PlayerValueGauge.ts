namespace PROJECT {
    export class PlayerValueGauge extends TOOLKIT.ScriptComponent {
        private amtImage: BABYLON.GUI.Image;
        private amtText: BABYLON.GUI.TextBlock;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.PlayerValueGauge") {
            super(transform, scene, properties, alias);
        }
        
        public updateValue(health: number, delta: number, maxHealth: number): void {
            if (this.amtImage) {
                const fillAmount = health / maxHealth;
                this.amtImage.width = `${fillAmount * 100}%`;
            }
            
            if (this.amtText) {
                const healthAsInt = health >= 0 ? Math.floor(health) : 0;
                this.amtText.text = healthAsInt.toString();
            }
        }
    }
}
