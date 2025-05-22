namespace PROJECT {
    export class SpawnerBehavior extends PROJECT.BehaviorTree {
        protected constructTree(rootNode: { value: PROJECT.BTNode }): void {
            const spawnTask = new PROJECT.BTTask_Spawn(this);
            const spawnCooldownDeco = new PROJECT.CooldownDecorator(this, spawnTask, 2.0);
            const spawnBBDecorator = new PROJECT.BlackboardDecorator(
                this, 
                spawnCooldownDeco, 
                "Target", 
                PROJECT.BlackboardDecorator.RunCondition.KeyExists, 
                PROJECT.BlackboardDecorator.NotifyRule.RunConditionChange, 
                PROJECT.BlackboardDecorator.NotifyAbort.Both
            );

            rootNode.value = spawnBBDecorator;
        }
    }
}
