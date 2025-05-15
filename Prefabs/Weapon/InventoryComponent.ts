/**
 * InventoryComponent - Manages weapon inventory and weapon switching
 */
namespace PROJECT {
    export class InventoryComponent extends TOOLKIT.ScriptComponent implements PROJECT.IPurchaseListener {
        private initWeaponsPrefabs: PROJECT.Weapon[] = [];
        private defaultWeaponSlot: BABYLON.TransformNode = null;
        private weaponSlots: BABYLON.TransformNode[] = [];
        private weapons: PROJECT.Weapon[] = [];
        private currentWeaponIndex: number = -1;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
            super(transform, scene, properties, "PROJECT.InventoryComponent");
        }

        protected start(): void {
            this.initializeWeapons();
        }

        private initializeWeapons(): void {
            this.weapons = [];
            for (let weapon of this.initWeaponsPrefabs) {
                this.giveNewWeapon(weapon);
            }

            this.nextWeapon();
        }

        private giveNewWeapon(weapon: PROJECT.Weapon): void {
            let weaponSlot: BABYLON.TransformNode = this.defaultWeaponSlot;
            for (let slot of this.weaponSlots) {
                if (slot.name === weapon.getAttachSlotTag()) {
                    weaponSlot = slot;
                }
            }
            
            let newWeapon = TOOLKIT.SceneManager.InstantiatePrefab(weapon, weaponSlot) as PROJECT.Weapon;
            newWeapon.init(this.transform);
            this.weapons.push(newWeapon);
        }

        public nextWeapon(): void {
            let nextWeaponIndex: number = this.currentWeaponIndex + 1;
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
            if (weaponIndex < 0 || weaponIndex >= this.weapons.length) {
                return;
            }

            if (this.currentWeaponIndex >= 0 && this.currentWeaponIndex < this.weapons.length) {
                this.weapons[this.currentWeaponIndex].unEquip();
            }

            this.weapons[weaponIndex].equip();
            this.currentWeaponIndex = weaponIndex;
        }

        public handlePurchase(newPurchase: any): boolean {
            let itemAsWeapon = newPurchase as PROJECT.Weapon;
            if (!itemAsWeapon) return false;

            let hasWeapon: boolean = true;
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
