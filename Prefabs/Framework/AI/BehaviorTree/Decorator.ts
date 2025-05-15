/**
 * Decorator - Abstract base class for behavior tree decorators
 */
namespace PROJECT {
    export abstract class Decorator extends PROJECT.BTNode {
        private child: PROJECT.BTNode = null;
        
        constructor(child: PROJECT.BTNode) {
            super(null); // Note: C# version doesn't pass tree to base constructor
            this.child = child;
        }
        
        protected getChild(): PROJECT.BTNode {
            return this.child;
        }
        
        public sortPriority(priorityCounter: { value: number }): void {
            super.sortPriority(priorityCounter);
            this.child.sortPriority(priorityCounter);
        }
        
        public initialize(): void {
            super.initialize();
            this.child.initialize();
        }
        
        public get(): PROJECT.BTNode {
            return this.child.get();
        }
    }
}
