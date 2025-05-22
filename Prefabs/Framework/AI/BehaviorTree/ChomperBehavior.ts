namespace PROJECT {
    export class ChomperBehavior extends PROJECT.BehaviorTree {
        protected constructTree(rootNode: { node: PROJECT.BTNode }): void {
            const rootSelector = new PROJECT.Selector(this.transform, this.scene);
            
            rootSelector.addChild(new PROJECT.BTTaskGroup_AttackTarget(this.transform, this.scene, {
                tree: this,
                attackDistance: 2,
                attackCooldown: 10.0
            }));
            
            rootSelector.addChild(new PROJECT.BTTaskGroup_MoveToLastSeenLoc(this.transform, this.scene, {
                tree: this,
                moveSpeed: 3
            }));
            
            rootSelector.addChild(new PROJECT.BTTaskGroup_Patrolling(this.transform, this.scene, {
                tree: this,
                moveSpeed: 3
            }));
            
            rootNode.node = rootSelector;
        }
    }
}
