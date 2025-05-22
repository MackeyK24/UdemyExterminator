namespace PROJECT {
    export class DamageVisualiser extends TOOLKIT.ScriptComponent {
        private mesh: BABYLON.Mesh;
        private damageEmmisionColor: BABYLON.Color3;
        private blinkSpeed: number = 2.0;
        private emmisionColorPropertyName: string = "_Addtion";
        private healthComponent: PROJECT.HealthComponent;
        private origionalEmissionColor: BABYLON.Color3;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.DamageVisualiser") {
            super(transform, scene, properties, alias);
            
            if (properties.mesh) this.mesh = properties.mesh;
            if (properties.damageEmmisionColor) this.damageEmmisionColor = properties.damageEmmisionColor;
            if (properties.blinkSpeed) this.blinkSpeed = properties.blinkSpeed;
            if (properties.emmisionColorPropertyName) this.emmisionColorPropertyName = properties.emmisionColorPropertyName;
            if (properties.healthComponent) this.healthComponent = properties.healthComponent;
        }

        protected start(): void {
            const mat = this.mesh.material;
            const newMaterial = new BABYLON.StandardMaterial("DamageMaterial", this.scene);
            newMaterial.clone(mat);
            this.mesh.material = newMaterial;
            
            this.origionalEmissionColor = this.mesh.material.getEmissiveColor();
            
            this.healthComponent.onTakeDamage.push(this.tookDamage.bind(this));
        }

        protected tookDamage(health: number, delta: number, maxHealth: number, instigator: BABYLON.TransformNode): void {
            const currentEmmisionColor = this.mesh.material.getEmissiveColor();
            
            if (Math.abs(currentEmmisionColor.subtract(this.origionalEmissionColor).toGrayscale().r) < 0.1) {
                this.mesh.material.emissiveColor = this.damageEmmisionColor;
            }
        }

        protected update(): void {
            const currentEmmisionColor = this.mesh.material.getEmissiveColor();
            const newEmmisionColor = BABYLON.Color3.Lerp(
                currentEmmisionColor, 
                this.origionalEmissionColor, 
                this.getDeltaTime() * this.blinkSpeed
            );
            
            this.mesh.material.emissiveColor = newEmmisionColor;
        }
    }
}
