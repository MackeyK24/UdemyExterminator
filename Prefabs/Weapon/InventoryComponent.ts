namespace PROJECT {
    export class InventoryComponent extends TOOLKIT.ScriptComponent implements PROJECT.IPurchaseListener {
        private initWeaponsPrefabs: PROJECT.Weapon[];
        private defaultWeaponSlot: BABYLON.TransformNode;
        private weaponSlots: BABYLON.TransformNode[];
        
        private weapons: PROJECT.Weapon[] = [];
        private currentWeaponIndex: number = -1;
        
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.InventoryComponent") {
            super(transform, scene, properties, alias);
        }
        
        protected start(): void {
            this.initializeWeapons();
        }
        
        private initializeWeapons(): void {
            this.weapons = [];
            
            if (this.initWeaponsPrefabs) {
                for (const weapon of this.initWeaponsPrefabs) {
                    this.giveNewWeapon(weapon);
                }
            }
            
            this.nextWeapon();
        }
        
        private giveNewWeapon(weapon: PROJECT.Weapon): void {
            let weaponSlot = this.defaultWeaponSlot;
            
            if (this.weaponSlots) {
                for (const slot of this.weaponSlots) {
                    if (slot.name === weapon.getAttachSlotTag()) {
                        weaponSlot = slot;
                    }
                }
            }
            
            const newWeaponTransform = TOOLKIT.SceneManager.InstantiatePrefabFromContainer(
                this.scene,
                weapon.transform.name,
                "Weapon_" + this.weapons.length
            );
            
            const newWeapon = TOOLKIT.SceneManager.FindScriptComponent(newWeaponTransform, "PROJECT.Weapon") as PROJECT.Weapon;
            
            if (newWeapon) {
                newWeaponTransform.parent = weaponSlot;
                
                newWeapon.init(this.transform);
                
                this.weapons.push(newWeapon);
            }
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
            if (!newPurchase || !newPurchase.transform) {
                return false;
            }
            
            const itemAsWeapon = TOOLKIT.SceneManager.FindScriptComponent(newPurchase.transform, "PROJECT.Weapon") as PROJECT.Weapon;
            if (!itemAsWeapon) {
                return false;
            }
            
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
