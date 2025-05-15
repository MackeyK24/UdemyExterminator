/**
 * ITeamInterface - Interface for objects that have team affiliations
 */
namespace PROJECT {
    export interface ITeamInterface {
        getTeamID(): number;
        getRelationTowards(other: BABYLON.TransformNode): PROJECT.ETeamRelation;
    }
    
    export class TeamInterfaceHelper extends TOOLKIT.ScriptComponent {
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.TeamInterfaceHelper");
        }
        
        public static getDefaultTeamID(): number {
            return -1;
        }
        
        public static getDefaultRelationTowards(self: BABYLON.TransformNode, other: BABYLON.TransformNode): PROJECT.ETeamRelation {
            const otherTeamInterface = other.getComponent("PROJECT.ITeamInterface") as PROJECT.ITeamInterface;
            if (!otherTeamInterface) {
                return PROJECT.ETeamRelation.Neutral;
            }
            
            const selfTeamInterface = self.getComponent("PROJECT.ITeamInterface") as PROJECT.ITeamInterface;
            if (!selfTeamInterface) {
                return PROJECT.ETeamRelation.Neutral;
            }
            
            if (otherTeamInterface.getTeamID() === selfTeamInterface.getTeamID()) {
                return PROJECT.ETeamRelation.Friendly;
            } else if (otherTeamInterface.getTeamID() === -1 || selfTeamInterface.getTeamID() === -1) {
                return PROJECT.ETeamRelation.Neutral;
            }
            
            return PROJECT.ETeamRelation.Enemy;
        }
    }
}
