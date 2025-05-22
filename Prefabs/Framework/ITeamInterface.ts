namespace PROJECT {
    export enum ETeamRelation {
        Friendly,
        Enemy,
        Neutral
    }

    export interface ITeamInterface {
        getTeamID?: () => number;
        getRelationTowards?: (other: BABYLON.TransformNode) => PROJECT.ETeamRelation;
    }
}
