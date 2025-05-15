/**
 * DamageComponent - Abstract base class for damage-dealing components with team-based targeting
 */
namespace PROJECT {
    export enum ETeamRelation {
        Friendly,
        Enemy,
        Neutral
    }
    
    export abstract class DamageComponent extends TOOLKIT.ScriptComponent implements PROJECT.ITeamInterface {
        protected damageFriendly: boolean = false;
        protected damageEnemy: boolean = true;
        protected damageNeutral: boolean = false;
        
        private teamInterface: PROJECT.ITeamInterface = null;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.DamageComponent");
        }
        
        public getTeamID(): number {
            if (this.teamInterface) {
                return this.teamInterface.getTeamID();
            }
            return -1;
        }
        
        public setTeamInterfaceSrc(teamInterface: PROJECT.ITeamInterface): void {
            this.teamInterface = teamInterface;
        }
        
        public shouldDamage(other: BABYLON.TransformNode): boolean {
            if (!this.teamInterface) {
                return false;
            }
            
            const relation = this.teamInterface.getRelationTowards(other);
            
            if (this.damageFriendly && relation === ETeamRelation.Friendly) {
                return true;
            }
            
            if (this.damageEnemy && relation === ETeamRelation.Enemy) {
                return true;
            }
            
            if (this.damageNeutral && relation === ETeamRelation.Neutral) {
                return true;
            }
            
            return false;
        }
    }
}
