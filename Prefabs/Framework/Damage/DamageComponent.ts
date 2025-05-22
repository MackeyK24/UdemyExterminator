namespace PROJECT {
    export abstract class DamageComponent extends TOOLKIT.ScriptComponent implements PROJECT.ITeamInterface {
        protected damageFriendly: boolean;
        protected damageEnemy: boolean;
        protected damageNeutral: boolean;
        private teamInterface: PROJECT.ITeamInterface;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.DamageComponent") {
            super(transform, scene, properties, alias);
            
            if (properties.damageFriendly) this.damageFriendly = properties.damageFriendly;
            if (properties.damageEnemy) this.damageEnemy = properties.damageEnemy;
            if (properties.damageNeutral) this.damageNeutral = properties.damageNeutral;
        }

        public getTeamID(): number {
            if (this.teamInterface != null) {
                return this.teamInterface.getTeamID();
            }
            return -1;
        }

        public setTeamInterfaceSrc(teamInterface: PROJECT.ITeamInterface): void {
            this.teamInterface = teamInterface;
        }

        public shouldDamage(other: BABYLON.TransformNode): boolean {
            if (this.teamInterface == null) {
                return false;
            }

            const relation: PROJECT.ETeamRelation = this.teamInterface.getRelationTowards(other);
            
            if (this.damageFriendly && relation == PROJECT.ETeamRelation.Friendly) {
                return true;
            }

            if (this.damageEnemy && relation == PROJECT.ETeamRelation.Enemy) {
                return true;
            }

            if (this.damageNeutral && relation == PROJECT.ETeamRelation.Neutral) {
                return true;
            }

            return false;
        }
    }
}
