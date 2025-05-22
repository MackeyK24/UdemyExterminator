namespace PROJECT {
    export class BTTaskGroup_MoveToLastSeenLoc extends PROJECT.BTTask_Group {
        private acceptableDistance: number;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BTTaskGroup_MoveToLastSeenLoc") {
            super(transform, scene, properties, alias);
            
            if (properties.tree) this.tree = properties.tree;
            if (properties.acceptableDistance) this.acceptableDistance = properties.acceptableDistance;
            else this.acceptableDistance = 3;
        }
        
        protected constructTree(root: PROJECT.BTNode): void {
            const checkLastSeenLocSeq = new PROJECT.Sequencer(this.transform, this.scene);
            const moveToLastSeenLoc = new PROJECT.BTTask_MoveToLoc(this.transform, this.scene, {
                tree: this.tree,
                locKey: "LastSeenLoc",
                acceptableDistance: this.acceptableDistance
            });
            
            const waitAtLastSeenLoc = new PROJECT.BTTask_Wait(this.transform, this.scene, {
                waitTime: 2.0
            });
            
            const removeLastSeenLoc = new PROJECT.BTTask_RemoveBlackboardData(this.transform, this.scene, {
                tree: this.tree,
                key: "LastSeenLoc"
            });
            
            checkLastSeenLocSeq.addChild(moveToLastSeenLoc);
            checkLastSeenLocSeq.addChild(waitAtLastSeenLoc);
            checkLastSeenLocSeq.addChild(removeLastSeenLoc);
            
            const checkLastSeenLocDecorator = new PROJECT.BlackboardDecorator(this.transform, this.scene, {
                tree: this.tree,
                child: checkLastSeenLocSeq,
                key: "LastSeenLoc",
                runCondition: PROJECT.BlackboardDecorator.RunCondition.KeyExists,
                notifyRule: PROJECT.BlackboardDecorator.NotifyRule.RunConditionChange,
                notifyAbort: PROJECT.BlackboardDecorator.NotifyAbort.none
            });
            
            root = checkLastSeenLocDecorator;
        }
    }
}
