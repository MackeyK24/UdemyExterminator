namespace PROJECT {
    export class HealthBar extends TOOLKIT.ScriptComponent {
        private healthSlider: BABYLON.GUI.Slider;
        private attachPoint: BABYLON.TransformNode;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.HealthBar") {
            super(transform, scene, properties, alias);
        }
        
        public init(attachPoint: BABYLON.TransformNode): void {
            this.attachPoint = attachPoint;
        }
        
        public setHealthSliderValue(health: number, delta: number, maxHealth: number): void {
            if (this.healthSlider) {
                this.healthSlider.value = health / maxHealth;
            }
        }
        
        protected update(): void {
            if (this.transform && this.attachPoint) {
                const camera = this.scene.activeCamera;
                
                if (camera) {
                    const attachScreenPoint = BABYLON.Vector3.Project(
                        this.attachPoint.position,
                        BABYLON.Matrix.Identity(),
                        this.scene.getTransformMatrix(),
                        camera.viewport.toGlobal(
                            this.scene.getEngine().getRenderWidth(),
                            this.scene.getEngine().getRenderHeight()
                        )
                    );
                    
                    if (this.transform.position) {
                        this.transform.position.x = attachScreenPoint.x;
                        this.transform.position.y = attachScreenPoint.y;
                    }
                }
            }
        }
        
        public onOwnerDead(killer: BABYLON.TransformNode): void {
            if (this.transform) {
                this.transform.dispose();
            }
        }
    }
}
