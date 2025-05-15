/**
 * CooldownDecorator - Behavior tree decorator that adds a cooldown mechanism to a child node
 */
namespace PROJECT {
    export class CooldownDecorator extends PROJECT.Decorator {
        private cooldownTime: number = 0;
        private lastExecutionTime: number = -1;
        private failOnCooldown: boolean = false;
        
        constructor(tree: PROJECT.BehaviorTree, child: PROJECT.BTNode, cooldownTime: number, failOnCooldown: boolean = false) {
            super(child);
            this.cooldownTime = cooldownTime;
            this.failOnCooldown = failOnCooldown;
        }
        
        protected execute(): PROJECT.NodeResult {
            if (this.cooldownTime === 0)
                return PROJECT.NodeResult.Inprogress;
            
            if (this.lastExecutionTime === -1) {
                this.lastExecutionTime = this.getTimeElapsed();
                return PROJECT.NodeResult.Inprogress;
            }
            
            if (this.getTimeElapsed() - this.lastExecutionTime < this.cooldownTime) {
                if (this.failOnCooldown) {
                    return PROJECT.NodeResult.Failure;
                } else {
                    return PROJECT.NodeResult.Success;
                }
            }
            
            this.lastExecutionTime = this.getTimeElapsed();
            return PROJECT.NodeResult.Inprogress;
        }
        
        protected update(): PROJECT.NodeResult {
            return this.getChild().updateNode();
        }
        
        private getTimeElapsed(): number {
            return this.scene ? this.scene.getEngine().getTimeFromStartInSeconds() : 0;
        }
    }
}
