namespace PROJECT {
    export class SpiterBehavior extends PROJECT.BehaviorTree {
        protected constructTree(rootNode: { value: PROJECT.BTNode }): void {
            const rootSelector = new PROJECT.Selector();

            rootSelector.addChild(new PROJECT.BTTaskGroup_AttackTarget(this, 5, 10.0, 4.0));

            rootSelector.addChild(new PROJECT.BTTaskGroup_MoveToLastSeenLoc(this, 3));

            rootSelector.addChild(new PROJECT.BTTaskGroup_Patrolling(this, 3));

            rootNode.value = rootSelector;
        }
    }
}
