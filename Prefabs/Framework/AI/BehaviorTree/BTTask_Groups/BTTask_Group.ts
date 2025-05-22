namespace PROJECT {
    export abstract class BTTask_Group extends PROJECT.BTNode {
        private root: PROJECT.BTNode;
        protected tree: PROJECT.BehaviorTree;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BTTask_Group") {
            super(transform, scene, properties, alias);
        }
        
        public initialize(tree: PROJECT.BehaviorTree): void {
            this.tree = tree;
        }
        
        protected abstract constructTree(rootNode: { node: PROJECT.BTNode }): void;
        
        protected override execute(): PROJECT.NodeResult {
            return PROJECT.NodeResult.Inprogress;
        }
        
        protected override update(): PROJECT.NodeResult {
            return this.root.updateNode();
        }
        
        protected override end(): void {
            this.root.abort();
            super.end();
        }
        
        public override sortPriority(priorityCounter: number): void {
            super.sortPriority(priorityCounter);
            this.root.sortPriority(priorityCounter);
        }
        
        public override initialize(): void {
            super.initialize();
            this.constructTree({ node: null });
            this.root = this.node;
        }
        
        public override get(): PROJECT.BTNode {
            return this.root.get();
        }
    }
}
