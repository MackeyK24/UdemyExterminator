namespace PROJECT {
    export class BTTask_AlwaysFail extends PROJECT.BTNode {
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BTTask_AlwaysFail") {
            super(transform, scene, properties, alias);
        }

        protected execute(): PROJECT.NodeResult {
            console.log("Failed");
            return PROJECT.NodeResult.Failure;
        }
    }
}
