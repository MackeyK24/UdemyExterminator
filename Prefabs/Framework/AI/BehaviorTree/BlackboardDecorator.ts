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
        }
        
        public initialize(tree: PROJECT.BehaviorTree, 
                         child: PROJECT.BTNode, 
                         key: string, 
                         runCondition: PROJECT.ERunCondition, 
                         notifyRule: PROJECT.ENotifyRule, 
                         notifyAbort: PROJECT.ENotifyAbort): void {
            this.tree = tree;
            this.key = key;
            this.runCondition = runCondition;
            this.notifyRule = notifyRule;
            this.notifyAbort = notifyAbort;
            this.addChild(child);
        }
        
        protected override execute(): PROJECT.NodeResult {
            const blackboard = this.tree.blackboard;
            if (!blackboard) {
                return PROJECT.NodeResult.Failure;
            }
            
            const checkNotifyIndex = blackboard.onBlackboardValueChange.indexOf(this.checkNotify.bind(this));
            if (checkNotifyIndex !== -1) {
                blackboard.onBlackboardValueChange.splice(checkNotifyIndex, 1);
            }
            
            blackboard.onBlackboardValueChange.push(this.checkNotify.bind(this));
            
            if (this.checkRunCondition()) {
                return PROJECT.NodeResult.Inprogress;
            } else {
                return PROJECT.NodeResult.Failure;
            }
        }
        
        private checkRunCondition(): boolean {
            let exists = false;
            this.tree.blackboard.getBlackboardData(this.key, (value: any) => {
                this.value = value;
                exists = true;
            });
            
            switch (this.runCondition) {
                case PROJECT.ERunCondition.KeyExists:
                    return exists;
                case PROJECT.ERunCondition.KeyNotExists:
                    return !exists;
            }
            
            return false;
        }
        
        private checkNotify(key: string, val: any): void {
            if (this.key !== key) return;
            
            if (this.notifyRule === PROJECT.ENotifyRule.RunConditionChange) {
                const prevExists = this.value != null;
                const currentExists = val != null;
                
                if (prevExists !== currentExists) {
                    this.notify();
                }
            } else if (this.notifyRule === PROJECT.ENotifyRule.KeyValueChange) {
                if (this.value !== val) {
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
        
        protected override update(): PROJECT.NodeResult {
            return this.getChild().updateNode();
        }
        
        protected override end(): void {
            this.getChild().abort();
            super.end();
        }
    }
}
