namespace PROJECT {
    export class HealthBar extends TOOLKIT.ScriptComponent {
        private healthSlider: BABYLON.GUI.Slider;
        private attachPoint: BABYLON.TransformNode;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.HealthBar") {
            super(transform, scene, properties, alias);
            
            if (properties.healthSlider) this.healthSlider = properties.healthSlider;
        }

        public init(attachPoint: BABYLON.TransformNode): void {
            this.attachPoint = attachPoint;
        }

        public setHealthSliderValue(health: number, delta: number, maxHealth: number): void {
            this.healthSlider.value = health / maxHealth;
        }

        protected update(): void {
            if (this.transform && this.attachPoint) {
                const camera = this.scene.activeCamera;
                
                const attachScreenPoint = BABYLON.Vector3.Project(
                    this.attachPoint.position,
                    BABYLON.Matrix.Identity(),
                    this.scene.getTransformMatrix(),
                    camera.viewport.toGlobal(
                        this.scene.getEngine().getRenderWidth(),
                        this.scene.getEngine().getRenderHeight()
                    )
                );
                
                this.transform.position = new BABYLON.Vector3(
                    attachScreenPoint.x,
                    attachScreenPoint.y,
                    this.transform.position.z
                );
            }
        }

        public onOwnerDead(killer: BABYLON.TransformNode): void {
            this.transform.dispose();
        }
    }
}
