/**
 * PerceptionStimuli - Registers object as a stimuli for AI perception
 */
namespace PROJECT {
    export class PerceptionStimuli extends TOOLKIT.ScriptComponent {
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.PerceptionStimuli");
        }
        
        protected start(): void {
            PROJECT.SenseComp.registerStimuli(this);
        }
        
        protected onDestroy(): void {
            PROJECT.SenseComp.unRegisterStimuli(this);
        }
    }
}
