namespace PROJECT {
    export class Sequencer extends PROJECT.Compositor {
        protected update(): PROJECT.NodeResult {
            const result = this.getCurrentChild().updateNode();
            
            if (result == PROJECT.NodeResult.Failure) {
                return PROJECT.NodeResult.Failure;
            }
            
            if (result == PROJECT.NodeResult.Success) {
                if (this.next()) {
                    return PROJECT.NodeResult.Inprogress;
                } else {
                    return PROJECT.NodeResult.Success;
                }
            }
            
            return PROJECT.NodeResult.Inprogress;
        }
    }
}
