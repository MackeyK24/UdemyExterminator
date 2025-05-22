namespace PROJECT {
    export class DamageVisualiser extends TOOLKIT.ScriptComponent {
        private mesh: BABYLON.Mesh;
        private damageEmmisionColor: BABYLON.Color3;
        private blinkSpeed: number = 2.0;
        private emmisionColorPropertyName: string = "emissiveColor";
        private healthComponent: PROJECT.HealthComponent;
        private origionalEmissionColor: BABYLON.Color3;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.DamageVisualiser") {
            super(transform, scene, properties, alias);
        }
        
        protected start(): void {
            this.mesh = this.transform as BABYLON.Mesh;
            
            if (this.mesh && this.mesh.material) {
                const originalMaterial = this.mesh.material;
                const newMaterial = originalMaterial.clone("damageMaterial");
                this.mesh.material = newMaterial;
                
                if (newMaterial.getClassName() === "PBRMaterial") {
                    const pbrMaterial = newMaterial as BABYLON.PBRMaterial;
                    this.origionalEmissionColor = pbrMaterial.emissiveColor.clone();
                } else if (newMaterial.getClassName() === "StandardMaterial") {
                    const standardMaterial = newMaterial as BABYLON.StandardMaterial;
                    this.origionalEmissionColor = standardMaterial.emissiveColor.clone();
                }
                
                if (this.healthComponent) {
                    this.healthComponent.onTakeDamage.push(this.tookDamage.bind(this));
                }
            }
        }
        
        protected tookDamage(health: number, delta: number, maxHealth: number, instigator: BABYLON.TransformNode): void {
            if (!this.mesh || !this.mesh.material) return;
            
            let currentEmmisionColor: BABYLON.Color3;
            
            if (this.mesh.material.getClassName() === "PBRMaterial") {
                const pbrMaterial = this.mesh.material as BABYLON.PBRMaterial;
                currentEmmisionColor = pbrMaterial.emissiveColor;
                
                if (Math.abs(currentEmmisionColor.r - this.origionalEmissionColor.r) < 0.1 &&
                    Math.abs(currentEmmisionColor.g - this.origionalEmissionColor.g) < 0.1 &&
                    Math.abs(currentEmmisionColor.b - this.origionalEmissionColor.b) < 0.1) {
                    pbrMaterial.emissiveColor = this.damageEmmisionColor.clone();
                }
            } else if (this.mesh.material.getClassName() === "StandardMaterial") {
                const standardMaterial = this.mesh.material as BABYLON.StandardMaterial;
                currentEmmisionColor = standardMaterial.emissiveColor;
                
                if (Math.abs(currentEmmisionColor.r - this.origionalEmissionColor.r) < 0.1 &&
                    Math.abs(currentEmmisionColor.g - this.origionalEmissionColor.g) < 0.1 &&
                    Math.abs(currentEmmisionColor.b - this.origionalEmissionColor.b) < 0.1) {
                    standardMaterial.emissiveColor = this.damageEmmisionColor.clone();
                }
            }
        }
        
        protected update(): void {
            if (!this.mesh || !this.mesh.material) return;
            
            if (this.mesh.material.getClassName() === "PBRMaterial") {
                const pbrMaterial = this.mesh.material as BABYLON.PBRMaterial;
                const currentEmmisionColor = pbrMaterial.emissiveColor;
                
                const newEmmisionColor = BABYLON.Color3.Lerp(
                    currentEmmisionColor,
                    this.origionalEmissionColor,
                    this.getDeltaTime() * this.blinkSpeed
                );
                
                pbrMaterial.emissiveColor = newEmmisionColor;
            } else if (this.mesh.material.getClassName() === "StandardMaterial") {
                const standardMaterial = this.mesh.material as BABYLON.StandardMaterial;
                const currentEmmisionColor = standardMaterial.emissiveColor;
                
                const newEmmisionColor = BABYLON.Color3.Lerp(
                    currentEmmisionColor,
                    this.origionalEmissionColor,
                    this.getDeltaTime() * this.blinkSpeed
                );
                
                standardMaterial.emissiveColor = newEmmisionColor;
            }
        }
    }
}
