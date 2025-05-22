namespace PROJECT {
    export class CooldownDecorator extends PROJECT.Decorator {
        private cooldownTime: number;
        private lastExecutionTime: number = -1;
        private failOnCooldown: boolean;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.CooldownDecorator") {
            super(transform, scene, properties, alias);
        }
        
        public initialize(tree: PROJECT.BehaviorTree, child: PROJECT.BTNode, cooldownTime: number, failOnCooldown: boolean = false): void {
            super.initialize(child);
            this.cooldownTime = cooldownTime;
            this.failOnCooldown = failOnCooldown;
        }
        
        protected override execute(): PROJECT.NodeResult {
            if (this.cooldownTime === 0)
                return PROJECT.NodeResult.Inprogress;
            
            if (this.lastExecutionTime === -1) {
                this.lastExecutionTime = BABYLON.Tools.Now / 1000; // Convert to seconds
                return PROJECT.NodeResult.Inprogress;
            }
            
            const currentTime = BABYLON.Tools.Now / 1000; // Convert to seconds
            if (currentTime - this.lastExecutionTime < this.cooldownTime) {
                if (this.failOnCooldown) {
                    return PROJECT.NodeResult.Failure;
                } else {
                    return PROJECT.NodeResult.Success;
                }
            }
            
            this.lastExecutionTime = currentTime;
            return PROJECT.NodeResult.Inprogress;
        }
        
        protected override update(): PROJECT.NodeResult {
            return this.getChild().updateNode();
        }
    }
}
