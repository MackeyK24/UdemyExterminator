namespace PROJECT {
    export abstract class Weapon extends TOOLKIT.ScriptComponent {
        private attachSlotTag: string;
        private attackRateMult: number = 1;
        private overrideController: any; // AnimatorOverrideController equivalent
        private weaponAudio: BABYLON.Sound;
        private volume: number = 1;
        private weaponAudioSource: TOOLKIT.AudioSource;
        private owner: BABYLON.TransformNode;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.Weapon") {
            super(transform, scene, properties, alias);
            
            if (properties.attachSlotTag) this.attachSlotTag = properties.attachSlotTag;
            if (properties.attackRateMult) this.attackRateMult = properties.attackRateMult;
            if (properties.overrideController) this.overrideController = properties.overrideController;
            if (properties.weaponAudio) this.weaponAudio = properties.weaponAudio;
            if (properties.volume) this.volume = properties.volume;
        }

        protected awake(): void {
            this.weaponAudioSource = this.getComponent("TOOLKIT.AudioSource") as TOOLKIT.AudioSource;
        }

        public playWeaponAudio(): void {
            this.weaponAudioSource.play(this.weaponAudio, this.volume);
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
                if (this.overrideController) {
                }
                
                animator.setFloat("AttackRateMult", this.attackRateMult);
            }
        }

        public unEquip(): void {
            this.transform.setEnabled(false);
        }

        public damageGameObject(objToDamage: BABYLON.TransformNode, amt: number): void {
            if (!objToDamage) return;
            
            const healthComp = TOOLKIT.SceneManager.FindScriptComponent(objToDamage, "PROJECT.HealthComponent") as PROJECT.HealthComponent;
            if (healthComp != null) {
                healthComp.changeHealth(-amt, this.owner);
            }
        }
    }
}
