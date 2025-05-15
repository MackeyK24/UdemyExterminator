/**
 * HealthBar - UI component for displaying health values
 */
namespace PROJECT {
    export class HealthBar extends TOOLKIT.ScriptComponent {
        private healthSlider: BABYLON.GUI.Slider = null;
        private attachPoint: BABYLON.TransformNode = null;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.HealthBar");
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
                    
                    this.transform.position = new BABYLON.Vector3(
                        attachScreenPoint.x,
                        attachScreenPoint.y,
                        0
                    );
                }
            }
        }

        public onOwnerDead(killer: BABYLON.TransformNode): void {
            this.transform.dispose();
        }
    }
}
