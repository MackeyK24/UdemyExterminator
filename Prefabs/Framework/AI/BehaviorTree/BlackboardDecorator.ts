namespace PROJECT {
    export enum ERunCondition {
        KeyExists,
        KeyNotExists
    }
    
    export enum ENotifyRule {
        RunConditionChange,
        KeyValueChange
    }
    
    export enum ENotifyAbort {
        None,
        Self,
        Lower,
        Both
    }
    
    export class BlackboardDecorator extends PROJECT.Decorator {
        private tree: PROJECT.BehaviorTree;
        private key: string;
        private value: any;
        
        private runCondition: PROJECT.ERunCondition;
        private notifyRule: PROJECT.ENotifyRule;
        private notifyAbort: PROJECT.ENotifyAbort;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.BlackboardDecorator") {
            super(transform, scene, properties, alias);
            
            if (properties.tree) this.tree = properties.tree;
            if (properties.key) this.key = properties.key;
            if (properties.runCondition) this.runCondition = properties.runCondition;
            if (properties.notifyRule) this.notifyRule = properties.notifyRule;
            if (properties.notifyAbort) this.notifyAbort = properties.notifyAbort;
        }
        
        protected execute(): PROJECT.NodeResult {
            const blackboard = this.tree.blackboardData;
            if (blackboard == null)
                return PROJECT.NodeResult.Failure;
                
            const index = blackboard.onBlackboardValueChange.indexOf(this.checkNotify.bind(this));
            if (index !== -1) {
                blackboard.onBlackboardValueChange.splice(index, 1);
            }
            
            blackboard.onBlackboardValueChange.push(this.checkNotify.bind(this));
            
            if (this.checkRunCondition()) {
                return PROJECT.NodeResult.Inprogress;
            } else {
                return PROJECT.NodeResult.Failure;
            }
        }
        
        private checkRunCondition(): boolean {
            const exists = this.tree.blackboardData.getBlackboardData(this.key, this.value);
            
            switch (this.runCondition) {
                case PROJECT.ERunCondition.KeyExists:
                    return exists;
                case PROJECT.ERunCondition.KeyNotExists:
                    return !exists;
            }
            
            return false;
        }
        
        private checkNotify(key: string, val: any): void {
            if (this.key != key) return;
            
            if (this.notifyRule == PROJECT.ENotifyRule.RunConditionChange) {
                const prevExists = this.value != null;
                const currentExists = val != null;
                
                if (prevExists != currentExists) {
                    this.notify();
                }
            } else if (this.notifyRule == PROJECT.ENotifyRule.KeyValueChange) {
                if (this.value != val) {
                    this.notify();
                }
            }
        }
        
        private notify(): void {
            switch (this.notifyAbort) {
                case PROJECT.ENotifyAbort.None:
                    break;
                case PROJECT.ENotifyAbort.Self:
                    this.abortSelf();
                    break;
                case PROJECT.ENotifyAbort.Lower:
                    this.abortLower();
                    break;
                case PROJECT.ENotifyAbort.Both:
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
