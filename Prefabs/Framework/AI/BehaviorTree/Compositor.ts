/**
 * Compositor - Abstract base class for behavior tree compositors
 */
namespace PROJECT {
    export abstract class Compositor extends PROJECT.BTNode {
        private children: PROJECT.BTNode[] = [];
        private currentChildIndex: number = -1;
        
        constructor(tree: PROJECT.BehaviorTree) {
            super(tree);
        }
        
        public addChild(newChild: PROJECT.BTNode): void {
            this.children.push(newChild);
        }
        
        protected execute(): PROJECT.NodeResult {
            if (this.children.length === 0) {
                return PROJECT.NodeResult.Success;
            }
            
            this.currentChildIndex = 0;
            return PROJECT.NodeResult.Inprogress;
        }
        
        protected getCurrentChild(): PROJECT.BTNode {
            if (this.currentChildIndex >= 0 && this.currentChildIndex < this.children.length) {
                return this.children[this.currentChildIndex];
            }
            return null;
        }
        
        protected next(): boolean {
            if (this.currentChildIndex < this.children.length - 1) {
                this.currentChildIndex++;
                return true;
            }
            return false;
        }
        
        protected end(): void {
            const currentChild = this.getCurrentChild();
            if (currentChild) {
                currentChild.abort();
            }
            this.currentChildIndex = -1;
        }
        
        public sortPriority(priorityCounter: { value: number }): void {
            super.sortPriority(priorityCounter);
            
            for (const child of this.children) {
                child.sortPriority(priorityCounter);
            }
        }
        
        public initialize(): void {
            super.initialize();
            
            for (const child of this.children) {
                child.initialize();
            }
        }
        
        public get(): PROJECT.BTNode {
            if (this.currentChildIndex === -1) {
                if (this.children.length !== 0) {
                    return this.children[0].get();
                } else {
                    return this;
                }
            }
            
            return this.getCurrentChild().get();
        }
    }
}
