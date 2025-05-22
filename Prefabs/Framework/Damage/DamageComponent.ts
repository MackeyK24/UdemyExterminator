namespace PROJECT {
    export abstract class DamageComponent extends TOOLKIT.ScriptComponent implements PROJECT.ITeamInterface {
        protected damageFriendly: boolean = false;
        protected damageEnemy: boolean = false;
        protected damageNeutral: boolean = false;
        private teamInterface: PROJECT.ITeamInterface;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.DamageComponent") {
            super(transform, scene, properties, alias);
        }
        
        public getTeamID(): number {
            if (this.teamInterface != null)
                return this.teamInterface.getTeamID();
            return -1;
        }
        
        public setTeamInterfaceSrc(teamInterface: PROJECT.ITeamInterface): void {
            this.teamInterface = teamInterface;
        }
        
        public shouldDamage(other: BABYLON.TransformNode): boolean {
            if (this.teamInterface == null)
                return false;
            
            const relation = this.teamInterface.getRelationTowards(other);
            if (this.damageFriendly && relation == PROJECT.ETeamRelation.Friendly)
                return true;
            
            if (this.damageEnemy && relation == PROJECT.ETeamRelation.Enemy)
                return true;
            
            if (this.damageNeutral && relation == PROJECT.ETeamRelation.Neutral)
                return true;
            
            return false;
        }
    }
}
