namespace PROJECT {
    export abstract class Decorator extends PROJECT.BTNode {
        private child: PROJECT.BTNode;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.Decorator") {
            super(transform, scene, properties, alias);
        }
        
        protected getChild(): PROJECT.BTNode {
            return this.child;
        }
        
        public addChild(child: PROJECT.BTNode): void {
            this.child = child;
        }
        
        public override sortPriority(priorityCounter: number): void {
            super.sortPriority(priorityCounter);
            this.child.sortPriority(priorityCounter);
        }
        
        public override initialize(): void {
            super.initialize();
            this.child.initialize();
        }
        
        public override get(): PROJECT.BTNode {
            return this.child.get();
        }
    }
}
