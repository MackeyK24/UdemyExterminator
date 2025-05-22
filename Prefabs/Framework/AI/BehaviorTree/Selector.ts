namespace PROJECT {
    export class Selector extends PROJECT.Compositor {
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.Selector") {
            super(transform, scene, properties, alias);
        }

        protected update(): PROJECT.NodeResult {
            const result = this.getCurrentChild().updateNode();
            
            if (result == PROJECT.NodeResult.Success) {
                return PROJECT.NodeResult.Success;
            }

            if (result == PROJECT.NodeResult.Failure) {
                if (this.next()) {
                    return PROJECT.NodeResult.Inprogress;
                } else {
                    return PROJECT.NodeResult.Failure;
                }
            }

            return PROJECT.NodeResult.Inprogress;
        }
    }
}
