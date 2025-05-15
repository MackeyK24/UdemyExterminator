/**
 * ISpawnInterface - Interface for objects that can be spawned by a spawner
 */
namespace PROJECT {
    export interface ISpawnInterface {
        spawnedBy(gameObject: BABYLON.TransformNode): void;
    }
}
