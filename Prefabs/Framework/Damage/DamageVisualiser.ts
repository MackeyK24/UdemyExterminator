/**
 * DamageVisualiser - Visualizes damage by changing mesh emission color
 */
namespace PROJECT {
    export class DamageVisualiser extends TOOLKIT.ScriptComponent {
        private mesh: BABYLON.Mesh = null;
        private damageEmissionColor: BABYLON.Color3 = new BABYLON.Color3(1, 0, 0); // Default red
        private blinkSpeed: number = 2.0;
        private emissionColorPropertyName: string = "_Addtion";
        private healthComponent: PROJECT.HealthComponent = null;
        private originalEmissionColor: BABYLON.Color3 = null;
        private material: BABYLON.Material = null;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.DamageVisualiser");
        }
        
        protected start(): void {
            if (!this.mesh) return;
            
            const sourceMaterial = this.mesh.material;
            if (!sourceMaterial) return;
            
            this.material = sourceMaterial.clone("damageMaterial");
            this.mesh.material = this.material;
            
            if (this.material instanceof BABYLON.StandardMaterial) {
                this.originalEmissionColor = this.material.emissiveColor.clone();
            } else if (this.material instanceof BABYLON.PBRMaterial) {
                this.originalEmissionColor = this.material.emissiveColor.clone();
            } else {
                const colorProperty = this.material.getProperty(this.emissionColorPropertyName);
                if (colorProperty && colorProperty instanceof BABYLON.Color3) {
                    this.originalEmissionColor = colorProperty.clone();
                } else {
                    this.originalEmissionColor = new BABYLON.Color3(0, 0, 0);
                }
            }
            
            if (this.healthComponent) {
                this.healthComponent.registerOnTakeDamage((health, delta, maxHealth, instigator) => {
                    this.tookDamage(health, delta, maxHealth, instigator);
                });
            }
        }
        
        protected tookDamage(health: number, delta: number, maxHealth: number, instigator: BABYLON.TransformNode): void {
            if (!this.material || !this.originalEmissionColor) return;
            
            let currentEmissionColor: BABYLON.Color3;
            
            if (this.material instanceof BABYLON.StandardMaterial) {
                currentEmissionColor = this.material.emissiveColor;
            } else if (this.material instanceof BABYLON.PBRMaterial) {
                currentEmissionColor = this.material.emissiveColor;
            } else {
                const colorProperty = this.material.getProperty(this.emissionColorPropertyName);
                if (colorProperty && colorProperty instanceof BABYLON.Color3) {
                    currentEmissionColor = colorProperty;
                } else {
                    return; // Can't get current color
                }
            }
            
            const colorDiff = currentEmissionColor.subtract(this.originalEmissionColor);
            const grayscaleDiff = (colorDiff.r + colorDiff.g + colorDiff.b) / 3;
            
            if (Math.abs(grayscaleDiff) < 0.1) {
                this.setEmissionColor(this.damageEmissionColor);
            }
        }
        
        protected update(): void {
            if (!this.material || !this.originalEmissionColor) return;
            
            let currentEmissionColor: BABYLON.Color3;
            
            if (this.material instanceof BABYLON.StandardMaterial) {
                currentEmissionColor = this.material.emissiveColor;
            } else if (this.material instanceof BABYLON.PBRMaterial) {
                currentEmissionColor = this.material.emissiveColor;
            } else {
                const colorProperty = this.material.getProperty(this.emissionColorPropertyName);
                if (colorProperty && colorProperty instanceof BABYLON.Color3) {
                    currentEmissionColor = colorProperty;
                } else {
                    return; // Can't get current color
                }
            }
            
            const lerpFactor = this.getDeltaTime() * this.blinkSpeed;
            const newEmissionColor = BABYLON.Color3.Lerp(
                currentEmissionColor,
                this.originalEmissionColor,
                lerpFactor
            );
            
            this.setEmissionColor(newEmissionColor);
        }
        
        private setEmissionColor(color: BABYLON.Color3): void {
            if (!this.material) return;
            
            if (this.material instanceof BABYLON.StandardMaterial) {
                this.material.emissiveColor = color;
            } else if (this.material instanceof BABYLON.PBRMaterial) {
                this.material.emissiveColor = color;
            } else {
                this.material.setProperty(this.emissionColorPropertyName, color);
            }
        }
    }
}
