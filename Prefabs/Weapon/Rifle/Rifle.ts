/**
 * Rifle - Specialized ranged weapon type
 */
namespace PROJECT {
    export class Rifle extends PROJECT.RangedWeapon {
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.Rifle");
        }
    }
}
