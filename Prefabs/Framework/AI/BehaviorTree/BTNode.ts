/**
 * BTNode - Base class for behavior tree nodes
 */
namespace PROJECT {
    export enum NodeResult {
        Success,
        Failure,
        Inprogress
    }
    
    export abstract class BTNode extends TOOLKIT.ScriptComponent {
        private started: boolean = false;
        private priority: number = 0;
        
        constructor(tree: PROJECT.BehaviorTree) {
            super(tree ? tree.transform : null, tree ? tree.scene : null, null, "PROJECT.BTNode");
        }
        
        public updateNode(): PROJECT.NodeResult {
            if (!this.started) {
                this.started = true;
                const execResult = this.execute();
                if (execResult !== PROJECT.NodeResult.Inprogress) {
                    this.endNode();
                    return execResult;
                }
            }
            
            const updateResult = this.update();
            if (updateResult !== PROJECT.NodeResult.Inprogress) {
                this.endNode();
            }
            return updateResult;
        }
        
        protected execute(): PROJECT.NodeResult {
            return PROJECT.NodeResult.Success;
        }
        
        protected update(): PROJECT.NodeResult {
            return PROJECT.NodeResult.Success;
        }
        
        protected end(): void {
        }
        
        private endNode(): void {
            this.started = false;
            this.end();
        }
        
        public abort(): void {
            this.endNode();
        }
        
        public getPriority(): number {
            return this.priority;
        }
        
        public sortPriority(priorityCounter: { value: number }): void {
            this.priority = priorityCounter.value++;
            console.log(`${this} has priority ${this.priority}`);
        }
        
        public initialize(): void {
        }
        
        public get(): PROJECT.BTNode {
            return this;
        }
    }
}
