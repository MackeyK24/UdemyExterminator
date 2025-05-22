namespace PROJECT {
    export abstract class Compositor extends PROJECT.BTNode {
        protected children: PROJECT.BTNode[] = [];
        protected currentChildIndex: number = -1;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.Compositor") {
            super(transform, scene, properties, alias);
        }
        
        public addChild(newChild: PROJECT.BTNode): void {
            this.children.push(newChild);
        }
        
        protected override execute(): PROJECT.NodeResult {
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
        
        protected override end(): void {
            if (this.currentChildIndex === -1) {
                return;
            }
            
            const currentChild = this.getCurrentChild();
            if (currentChild) {
                currentChild.abort();
            }
            
            this.currentChildIndex = -1;
            
            super.end();
        }
        
        public override sortPriority(priorityCounter: number): void {
            super.sortPriority(priorityCounter);
            
            for (const child of this.children) {
                child.sortPriority(priorityCounter);
            }
        }
        
        public override initialize(): void {
            super.initialize();
            
            for (const child of this.children) {
                child.initialize();
            }
        }
        
        public override get(): PROJECT.BTNode {
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
