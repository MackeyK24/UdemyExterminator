namespace PROJECT {
    export class BTTask_Log extends PROJECT.BTNode {
        private message: string;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BTTask_Log") {
            super(transform, scene, properties, alias);
            
            if (properties.message) this.message = properties.message;
        }
        
        protected execute(): PROJECT.NodeResult {
            console.log(this.message);
            return PROJECT.NodeResult.Success;
        }
    }
}
