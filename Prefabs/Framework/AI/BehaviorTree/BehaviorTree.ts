namespace PROJECT {
    export abstract class BehaviorTree extends TOOLKIT.ScriptComponent {
        private root: PROJECT.BTNode;
        private blackboard: PROJECT.Blackboard = new PROJECT.Blackboard();
        private behaviorTreeInterface: PROJECT.IBehaviorTreeInterface;
        
        public get blackboard(): PROJECT.Blackboard {
            return this.blackboard;
        }
        
        private bRunBehaviorTree: boolean = true;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BehaviorTree") {
            super(transform, scene, properties, alias);
        }
        
        protected start(): void {
            this.behaviorTreeInterface = this.getComponent("PROJECT.IBehaviorTreeInterface") as PROJECT.IBehaviorTreeInterface;
            this.constructTree({ node: null });
            this.sortTree();
        }
        
        public getBehaviorTreeInterface(): PROJECT.IBehaviorTreeInterface {
            return this.behaviorTreeInterface;
        }
        
        private sortTree(): void {
            let priorityCounter = 0;
            this.root.initialize();
            this.root.sortPriority(priorityCounter);
        }
        
        protected abstract constructTree(rootNode: { node: PROJECT.BTNode }): void;
        
        protected update(): void {
            if (this.bRunBehaviorTree) {
                this.root.updateNode();
            }
        }
        
        public abortLowerThan(priority: number): void {
            const currentNode = this.root.get();
            if (currentNode.getPriority() > priority) {
                this.root.abort();
            }
        }
        
        public stopLogic(): void {
            this.bRunBehaviorTree = false;
        }
    }
}
