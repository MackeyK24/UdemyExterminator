namespace PROJECT {
    export class PerceptionStimuli extends TOOLKIT.ScriptComponent {
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.PerceptionStimuli") {
            super(transform, scene, properties, alias);
        }
        
        protected start(): void {
            PROJECT.SenseComp.registerStimuli(this);
        }
        
        protected onDestroy(): void {
            PROJECT.SenseComp.unRegisterStimuli(this);
        }
    }
}
