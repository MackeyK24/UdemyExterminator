namespace PROJECT {
    export abstract class Decorator extends PROJECT.BTNode {
        private child: PROJECT.BTNode;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.Decorator") {
            super(transform, scene, properties, alias);
            
            if (properties.child) this.child = properties.child;
        }
        
        protected getChild(): PROJECT.BTNode {
            return this.child;
        }
        
        public sortPriority(priorityCounter: number): void {
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
