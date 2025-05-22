namespace PROJECT {
    export abstract class Weapon extends TOOLKIT.ScriptComponent {
        private attachSlotTag: string;
        private attackRateMult: number = 1.0;
        private overrideController: BABYLON.AnimationGroup;
        
        private weaponAudio: BABYLON.Sound;
        private volume: number = 1.0;
        private weaponAudioSource: TOOLKIT.AudioSource;
        private owner: BABYLON.TransformNode;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.Weapon") {
            super(transform, scene, properties, alias);
        }
        
        protected awake(): void {
            this.weaponAudioSource = this.getComponent("TOOLKIT.AudioSource") as TOOLKIT.AudioSource;
        }
        
        public playWeaponAudio(): void {
            if (this.weaponAudioSource && this.weaponAudio) {
                this.weaponAudioSource.play(this.weaponAudio, this.volume);
            }
        }
        
        public abstract attack(): void;
        
        public getAttachSlotTag(): string {
            return this.attachSlotTag;
        }
        
        public getOwner(): BABYLON.TransformNode {
            return this.owner;
        }
        
        public init(owner: BABYLON.TransformNode): void {
            this.owner = owner;
            this.unEquip();
        }
        
        public equip(): void {
            this.transform.setEnabled(true);
            
            const animator = TOOLKIT.SceneManager.FindScriptComponent(this.owner, "TOOLKIT.AnimationState") as TOOLKIT.AnimationState;
            if (animator) {
                animator.playAnimation(this.overrideController);
                animator.setFloat("AttackRateMult", this.attackRateMult);
            }
        }
        
        public unEquip(): void {
            this.transform.setEnabled(false);
        }
        
        public damageGameObject(objToDamage: BABYLON.TransformNode, amt: number): void {
            const healthComp = TOOLKIT.SceneManager.FindScriptComponent(objToDamage, "PROJECT.HealthComponent") as PROJECT.HealthComponent;
            if (healthComp) {
                healthComp.changeHealth(-amt, this.owner);
            }
        }
    }
}
