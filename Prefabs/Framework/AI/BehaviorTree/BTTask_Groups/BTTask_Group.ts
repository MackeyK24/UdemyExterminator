namespace PROJECT {
    export abstract class BTTask_Group extends PROJECT.BTNode {
        private root: PROJECT.BTNode;
        protected tree: PROJECT.BehaviorTree;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BTTask_Group") {
            super(transform, scene, properties, alias);
            
            if (properties.tree) this.tree = properties.tree;
        }
        
        protected abstract constructTree(root: PROJECT.BTNode): void;
        
        protected execute(): PROJECT.NodeResult {
            return PROJECT.NodeResult.Inprogress;
        }
        
        protected update(): PROJECT.NodeResult {
            return this.root.updateNode();
        }
        
        protected end(): void {
            this.root.abort();
            super.end();
        }
        
        public sortPriority(priorityCounter: number): void {
            super.sortPriority(priorityCounter);
            this.root.sortPriority(priorityCounter);
        }
        
        public initialize(): void {
            super.initialize();
            this.constructTree(this.root);
        }
        
        public get(): PROJECT.BTNode {
            return this.root.get();
        }
    }
}
