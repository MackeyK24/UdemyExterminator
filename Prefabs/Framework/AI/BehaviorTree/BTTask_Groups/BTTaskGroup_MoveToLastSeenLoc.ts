namespace PROJECT {
    export class BTTaskGroup_MoveToLastSeenLoc extends PROJECT.BTTask_Group {
        private acceptableDistance: number;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BTTaskGroup_MoveToLastSeenLoc") {
            super(transform, scene, properties, alias);
        }
        
        public initialize(tree: PROJECT.BehaviorTree, acceptableDistance: number = 3.0): void {
            super.initialize(tree);
            this.acceptableDistance = acceptableDistance;
        }
        
        protected override constructTree(rootNode: { node: PROJECT.BTNode }): void {
            const checkLastSeenLocSeq = new PROJECT.Sequencer(this.transform, this.scene);
            
            const moveToLastSeenLoc = new PROJECT.BTTask_MoveToLoc(this.transform, this.scene);
            moveToLastSeenLoc.initialize(this.tree, "LastSeenLoc", this.acceptableDistance);
            
            const waitAtLastSeenLoc = new PROJECT.BTTask_Wait(this.transform, this.scene);
            waitAtLastSeenLoc.initialize(2.0);
            
            const removeLastSeenLoc = new PROJECT.BTTask_RemoveBlackboardData(this.transform, this.scene);
            removeLastSeenLoc.initialize(this.tree, "LastSeenLoc");
            
            checkLastSeenLocSeq.addChild(moveToLastSeenLoc);
            checkLastSeenLocSeq.addChild(waitAtLastSeenLoc);
            checkLastSeenLocSeq.addChild(removeLastSeenLoc);
            
            const checkLastSeenLocDecorator = new PROJECT.BlackboardDecorator(this.transform, this.scene);
            checkLastSeenLocDecorator.initialize(
                this.tree,
                checkLastSeenLocSeq,
                "LastSeenLoc",
                PROJECT.BlackboardDecorator.RunCondition.KeyExists,
                PROJECT.BlackboardDecorator.NotifyRule.RunConditionChange,
                PROJECT.BlackboardDecorator.NotifyAbort.None
            );
            
            rootNode.node = checkLastSeenLocDecorator;
        }
    }
}
