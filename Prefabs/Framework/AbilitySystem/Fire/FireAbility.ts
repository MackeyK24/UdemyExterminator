/**
 * FireAbility - Fire ability implementation with scanning and damage over time
 */
namespace PROJECT {
    export class FireAbility extends PROJECT.Ability {
        private scanerPrefab: PROJECT.Scaner = null;
        private fireRadius: number = 0;
        private fireDuration: number = 0;
        private damageDuration: number = 3.0;
        private fireDamage: number = 20.0;
        
        private scanVFX: BABYLON.TransformNode = null;
        private damageVFX: BABYLON.TransformNode = null;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.FireAbility");
        }
        
        public activateAbility(): void {
            if (!this.commitAbility()) return;
            
            const fireScaner = TOOLKIT.SceneManager.InstantiatePrefabFromContainer(
                this.abilityComp.transform, 
                this.scanerPrefab.transform.name, 
                "FireScaner"
            );
            
            const scanerComponent = fireScaner.getComponent("PROJECT.Scaner") as PROJECT.Scaner;
            if (scanerComponent) {
                scanerComponent.setScanRange(this.fireRadius);
                scanerComponent.setScanDuration(this.fireDuration);
                
                const scanVFXInstance = TOOLKIT.SceneManager.InstantiatePrefabFromContainer(
                    this.scene, 
                    this.scanVFX.name, 
                    "ScanVFX"
                );
                
                scanerComponent.addChildAttached(scanVFXInstance);
                scanerComponent.onScanDetectionUpdatedCallbacks.push(this.detectionUpdate.bind(this));
                scanerComponent.startScan();
            }
        }
        
        private detectionUpdate(newDetection: BABYLON.TransformNode): void {
            const detectedTeamInterface = newDetection.getComponent("PROJECT.ITeamInterface");
            if (!detectedTeamInterface || 
                detectedTeamInterface.getRelationTowards(this.abilityComp.transform) !== PROJECT.ETeamRelation.Enemy) {
                return;
            }
            
            const enemyHealthComp = newDetection.getComponent("PROJECT.HealthComponent") as PROJECT.HealthComponent;
            if (!enemyHealthComp) {
                return;
            }
            
            this.applyDamageTo(enemyHealthComp);
        }
        
        private applyDamageTo(enemyHealthComp: PROJECT.HealthComponent): void {
            const damageVFX = TOOLKIT.SceneManager.InstantiatePrefabFromContainer(
                enemyHealthComp.transform, 
                this.damageVFX.name, 
                "DamageVFX"
            );
            
            const damageRate = this.fireDamage / this.damageDuration;
            let startTime = 0;
            
            const damageInterval = this.scene.onBeforeRenderObservable.add(() => {
                if (startTime < this.damageDuration && enemyHealthComp) {
                    startTime += this.getDeltaTime();
                    enemyHealthComp.changeHealth(-damageRate * this.getDeltaTime(), this.abilityComp.transform);
                } else {
                    this.scene.onBeforeRenderObservable.remove(damageInterval);
                    
                    if (damageVFX) {
                        damageVFX.dispose();
                    }
                }
            });
        }
    }
}
