namespace PROJECT {
    export class InventoryComponent extends TOOLKIT.ScriptComponent implements PROJECT.IPurchaseListener {
        private initWeaponsPrefabs: PROJECT.Weapon[];
        private defaultWeaponSlot: BABYLON.TransformNode;
        private weaponSlots: BABYLON.TransformNode[];
        
        private weapons: PROJECT.Weapon[] = [];
        private currentWeaponIndex: number = -1;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.InventoryComponent") {
            super(transform, scene, properties, alias);
            
            if (properties.initWeaponsPrefabs) this.initWeaponsPrefabs = properties.initWeaponsPrefabs;
            if (properties.defaultWeaponSlot) this.defaultWeaponSlot = properties.defaultWeaponSlot;
            if (properties.weaponSlots) this.weaponSlots = properties.weaponSlots;
        }

        protected start(): void {
            this.initializeWeapons();
        }

        private initializeWeapons(): void {
            this.weapons = [];
            for (let i = 0; i < this.initWeaponsPrefabs.length; i++) {
                const weapon = this.initWeaponsPrefabs[i];
                this.giveNewWeapon(weapon);
            }

            this.nextWeapon();
        }

        private giveNewWeapon(weapon: PROJECT.Weapon): void {
            let weaponSlot = this.defaultWeaponSlot;
            for (let i = 0; i < this.weaponSlots.length; i++) {
                const slot = this.weaponSlots[i];
                if (slot.name === weapon.getAttachSlotTag()) {
                    weaponSlot = slot;
                }
            }
            
            const newWeaponNode = weapon.transform.clone("newWeapon");
            newWeaponNode.parent = weaponSlot;
            
            const newWeapon = TOOLKIT.SceneManager.FindScriptComponent(newWeaponNode, weapon.getClassName()) as PROJECT.Weapon;
            newWeapon.init(this.transform);
            this.weapons.push(newWeapon);
        }

        public nextWeapon(): void {
            let nextWeaponIndex = this.currentWeaponIndex + 1;
            if (nextWeaponIndex >= this.weapons.length) {
                nextWeaponIndex = 0;
            }

            this.equipWeapon(nextWeaponIndex);
        }

        public getActiveWeapon(): PROJECT.Weapon {
            if (this.hasWeapon()) {
                return this.weapons[this.currentWeaponIndex];
            }
            return null;
        }

        private equipWeapon(weaponIndex: number): void {
            if (weaponIndex < 0 || weaponIndex >= this.weapons.length)
                return;

            if (this.currentWeaponIndex >= 0 && this.currentWeaponIndex < this.weapons.length) {
                this.weapons[this.currentWeaponIndex].unEquip();
            }

            this.weapons[weaponIndex].equip();
            this.currentWeaponIndex = weaponIndex;
        }

        public handlePurchase(newPurchase: any): boolean {
            const itemAsGameObject = newPurchase as BABYLON.TransformNode;
            if (!itemAsGameObject) return false;

            const itemAsWeapon = TOOLKIT.SceneManager.FindScriptComponent(itemAsGameObject, "PROJECT.Weapon") as PROJECT.Weapon;
            if (!itemAsWeapon) return false;

            let hasWeapon = true;
            if (this.weapons.length === 0) {
                hasWeapon = false;
            }

            this.giveNewWeapon(itemAsWeapon);
            if (!hasWeapon) {
                this.equipWeapon(0);
            }
            return true;
        }

        public hasWeapon(): boolean {
            return this.weapons.length !== 0;
        }
    }
}
