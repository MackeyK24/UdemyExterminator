namespace PROJECT {
    export abstract class Compositor extends PROJECT.BTNode {
        private children: PROJECT.BTNode[] = [];
        private currentChild: PROJECT.BTNode = null;
        private currentIndex: number = -1;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.Compositor") {
            super(transform, scene, properties, alias);
        }
        
        public addChild(newChild: PROJECT.BTNode): void {
            this.children.push(newChild);
        }
        
        protected execute(): PROJECT.NodeResult {
            if (this.children.length === 0) {
                return PROJECT.NodeResult.Success;
            }
            
            this.currentIndex = 0;
            this.currentChild = this.children[0];
            return PROJECT.NodeResult.Inprogress;
        }
        
        protected getCurrentChild(): PROJECT.BTNode {
            return this.currentChild;
        }
        
        protected next(): boolean {
            if (this.currentIndex < this.children.length - 1) {
                this.currentIndex++;
                this.currentChild = this.children[this.currentIndex];
                return true;
            }
            return false;
        }
        
        protected end(): void {
            if (this.currentChild == null)
                return;
                
            this.currentChild.abort();
            this.currentChild = null;
            this.currentIndex = -1;
        }
        
        public sortPriority(priorityCounter: number): void {
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
            if (this.currentChild == null) {
                if (this.children.length !== 0) {
                    return this.children[0].get();
                } else {
                    return this;
                }
            }
            
            return this.currentChild.get();
        }
    }
}
