namespace PROJECT {
    export class PlayerValueGauge extends TOOLKIT.ScriptComponent {
        private amtImage: BABYLON.GUI.Image;
        private amtText: BABYLON.GUI.TextBlock;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.PlayerValueGauge") {
            super(transform, scene, properties, alias);
            
            if (properties.amtImage) this.amtImage = properties.amtImage;
            if (properties.amtText) this.amtText = properties.amtText;
        }

        public updateValue(health: number, delta: number, maxHealth: number): void {
            this.amtImage.stretch = BABYLON.GUI.Image.STRETCH_FILL;
            this.amtImage.width = (health / maxHealth) * 100 + "%";
            
            const healthAsInt = health >= 0 ? Math.floor(health) : 0;
            this.amtText.text = healthAsInt.toString();
        }
    }
}
