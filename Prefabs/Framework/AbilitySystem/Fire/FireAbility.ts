namespace PROJECT {
    export class FireAbility extends PROJECT.Ability {
        private scanerPrefab: PROJECT.Scaner;
        private fireRadius: number;
        private fireDuration: number;
        private damageDuration: number = 3.0;
        private fireDamage: number = 20.0;
        
        private scanVFX: BABYLON.TransformNode;
        private damageVFX: BABYLON.TransformNode;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.FireAbility") {
            super(transform, scene, properties, alias);
            
            if (properties.scanerPrefab) this.scanerPrefab = properties.scanerPrefab;
            if (properties.fireRadius) this.fireRadius = properties.fireRadius;
            if (properties.fireDuration) this.fireDuration = properties.fireDuration;
            if (properties.damageDuration) this.damageDuration = properties.damageDuration;
            if (properties.fireDamage) this.fireDamage = properties.fireDamage;
            if (properties.scanVFX) this.scanVFX = properties.scanVFX;
            if (properties.damageVFX) this.damageVFX = properties.damageVFX;
        }
        
        public activateAbility(): void {
            if (!this.commitAbility()) return;
            
            const fireScaner = TOOLKIT.SceneManager.InstantiatePrefab(
                this.scanerPrefab.transform,
                this.scene,
                this.abilityComp.transform
            ) as PROJECT.Scaner;
            
            fireScaner.setScanRange(this.fireRadius);
            fireScaner.setScanDuration(this.fireDuration);
            
            const scanVFXInstance = TOOLKIT.SceneManager.InstantiatePrefab(
                this.scanVFX,
                this.scene
            );
            
            fireScaner.addChildAttached(scanVFXInstance);
            fireScaner.onScanDetectionUpdated.push(this.detectionUpdate.bind(this));
            fireScaner.startScan();
        }
        
        private detectionUpdate(newDetection: BABYLON.TransformNode): void {
            const detectedTeamInterface = TOOLKIT.SceneManager.FindScriptComponent(
                newDetection, 
                "PROJECT.ITeamInterface"
            ) as PROJECT.ITeamInterface;
            
            if (detectedTeamInterface == null || 
                detectedTeamInterface.getRelationTowards(this.abilityComp.transform) != PROJECT.ETeamRelation.Enemy) {
                return;
            }
            
            const enemyHealthComp = TOOLKIT.SceneManager.FindScriptComponent(
                newDetection, 
                "PROJECT.HealthComponent"
            ) as PROJECT.HealthComponent;
            
            if (enemyHealthComp == null) {
                return;
            }
            
            this.applyDamageTo(enemyHealthComp);
        }
        
        private applyDamageTo(enemyHealthComp: PROJECT.HealthComponent): void {
            const damageVFX = TOOLKIT.SceneManager.InstantiatePrefab(
                this.damageVFX,
                this.scene,
                enemyHealthComp.transform
            );
            
            const damageRate = this.fireDamage / this.damageDuration;
            let startTime = 0;
            
            const damageInterval = setInterval(() => {
                if (startTime >= this.damageDuration || enemyHealthComp == null) {
                    clearInterval(damageInterval);
                    if (damageVFX != null) {
                        damageVFX.dispose();
                    }
                    return;
                }
                
                startTime += this.getDeltaTime();
                enemyHealthComp.changeHealth(-damageRate * this.getDeltaTime(), this.abilityComp.transform);
            }, 16); // ~60fps
        }
    }
}
