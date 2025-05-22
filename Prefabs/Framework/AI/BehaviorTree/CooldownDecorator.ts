namespace PROJECT {
    export class CooldownDecorator extends PROJECT.Decorator {
        private cooldownTime: number;
        private lastExecutionTime: number = -1;
        private failOnCooldown: boolean;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.CooldownDecorator") {
            super(transform, scene, properties, alias);
            
            if (properties.cooldownTime) this.cooldownTime = properties.cooldownTime;
            if (properties.failOnCooldown !== undefined) this.failOnCooldown = properties.failOnCooldown;
            else this.failOnCooldown = false;
        }
        
        protected execute(): PROJECT.NodeResult {
            if (this.cooldownTime == 0)
                return PROJECT.NodeResult.Inprogress;
                
            if (this.lastExecutionTime == -1) {
                this.lastExecutionTime = this.scene.getEngine().getTimeFromStartInSeconds();
                return PROJECT.NodeResult.Inprogress;
            }
            
            if (this.scene.getEngine().getTimeFromStartInSeconds() - this.lastExecutionTime < this.cooldownTime) {
                if (this.failOnCooldown) {
                    return PROJECT.NodeResult.Failure;
                } else {
                    return PROJECT.NodeResult.Success;
                }
            }
            
            this.lastExecutionTime = this.scene.getEngine().getTimeFromStartInSeconds();
            return PROJECT.NodeResult.Inprogress;
        }
        
        protected update(): PROJECT.NodeResult {
            return this.getChild().updateNode();
        }
    }
}
