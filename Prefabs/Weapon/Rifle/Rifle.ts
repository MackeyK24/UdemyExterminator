namespace PROJECT {
    export class Rifle extends PROJECT.RangedWeapon {
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.Rifle") {
            super(transform, scene, properties, alias);
        }
    }
}
