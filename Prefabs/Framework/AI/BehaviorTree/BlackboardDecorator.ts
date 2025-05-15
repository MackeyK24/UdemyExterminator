/**
 * BlackboardDecorator - Behavior tree decorator that monitors blackboard values
 */
namespace PROJECT {
    export enum RunCondition {
        KeyExists,
        KeyNotExists
    }
    
    export enum NotifyRule {
        RunConditionChange,
        KeyValueChange
    }
    
    export enum NotifyAbort {
        None,
        Self,
        Lower,
        Both
    }
    
    export class BlackboardDecorator extends PROJECT.Decorator {
        private tree: PROJECT.BehaviorTree = null;
        private key: string = "";
        private value: any = null;
        
        private runCondition: RunCondition = RunCondition.KeyExists;
        private notifyRule: NotifyRule = NotifyRule.RunConditionChange;
        private notifyAbort: NotifyAbort = NotifyAbort.None;
        
        constructor(
            tree: PROJECT.BehaviorTree,
            child: PROJECT.BTNode,
            key: string,
            runCondition: RunCondition,
            notifyRule: NotifyRule,
            notifyAbort: NotifyAbort
        ) {
            super(child);
            this.tree = tree;
            this.key = key;
            this.runCondition = runCondition;
            this.notifyRule = notifyRule;
            this.notifyAbort = notifyAbort;
        }
        
        protected execute(): PROJECT.NodeResult {
            const blackboard = this.tree.blackboard;
            if (!blackboard) {
                return PROJECT.NodeResult.Failure;
            }
            
            blackboard.unregisterOnBlackboardValueChange(this.checkNotify.bind(this));
            blackboard.registerOnBlackboardValueChange(this.checkNotify.bind(this));
            
            if (this.checkRunCondition()) {
                return PROJECT.NodeResult.Inprogress;
            } else {
                return PROJECT.NodeResult.Failure;
            }
        }
        
        private checkRunCondition(): boolean {
            const result = this.tree.blackboard.getBlackboardData(this.key);
            const exists = result.success;
            this.value = result.value;
            
            switch (this.runCondition) {
                case RunCondition.KeyExists:
                    return exists;
                case RunCondition.KeyNotExists:
                    return !exists;
                default:
                    return false;
            }
        }
        
        private checkNotify(key: string, val: any): void {
            if (this.key !== key) return;
            
            if (this.notifyRule === NotifyRule.RunConditionChange) {
                const prevExists = this.value != null;
                const currentExists = val != null;
                
                if (prevExists !== currentExists) {
                    this.notify();
                }
            } else if (this.notifyRule === NotifyRule.KeyValueChange) {
                if (this.value !== val) {
                    this.notify();
                }
            }
        }
        
        private notify(): void {
            switch (this.notifyAbort) {
                case NotifyAbort.None:
                    break;
                case NotifyAbort.Self:
                    this.abortSelf();
                    break;
                case NotifyAbort.Lower:
                    this.abortLower();
                    break;
                case NotifyAbort.Both:
                    this.abortBoth();
                    break;
            }
        }
        
        private abortBoth(): void {
            this.abort();
            this.abortLower();
        }
        
        private abortLower(): void {
            this.tree.abortLowerThan(this.getPriority());
        }
        
        private abortSelf(): void {
            this.abort();
        }
        
        protected update(): PROJECT.NodeResult {
            return this.getChild().updateNode();
        }
        
        protected end(): void {
            this.getChild().abort();
            super.end();
        }
    }
}
