/**
 * BTTask_Group - Abstract base class for behavior tree task groups
 */
namespace PROJECT {
    export abstract class BTTask_Group extends PROJECT.BTNode {
        private root: PROJECT.BTNode = null;
        protected tree: PROJECT.BehaviorTree = null;
        
        constructor(tree: PROJECT.BehaviorTree) {
            super(tree);
            this.tree = tree;
        }
        
        protected abstract constructTree(rootNode: { value: PROJECT.BTNode }): void;
        
        protected execute(): PROJECT.NodeResult {
            return PROJECT.NodeResult.Inprogress;
        }
        
        protected update(): PROJECT.NodeResult {
            return this.root.updateNode();
        }
        
        protected end(): void {
            this.root.abort();
        }
        
        public sortPriority(priorityCounter: { value: number }): void {
            super.sortPriority(priorityCounter);
            this.root.sortPriority(priorityCounter);
        }
        
        public initialize(): void {
            super.initialize();
            const rootNode = { value: null };
            this.constructTree(rootNode);
            this.root = rootNode.value;
        }
        
        public get(): PROJECT.BTNode {
            return this.root.get();
        }
    }
}
