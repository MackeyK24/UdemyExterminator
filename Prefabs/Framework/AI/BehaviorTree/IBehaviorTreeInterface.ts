/**
 * IBehaviorTreeInterface - Interface for behavior tree interactions
 */
namespace PROJECT {
    export interface IBehaviorTreeInterface {
        rotateTowards(target: BABYLON.TransformNode, verticalAim?: boolean): void;
        attackTarget(target: BABYLON.TransformNode): void;
    }
}
