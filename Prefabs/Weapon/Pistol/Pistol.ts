namespace PROJECT {
    export class Pistol extends PROJECT.RangedWeapon {
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.Pistol") {
            super(transform, scene, properties, alias);
        }
    }
}
