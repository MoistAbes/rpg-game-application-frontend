import {WeaponType} from './WeaponType';

export enum ItemType {
  COMMON_ITEM_INSTANCE = 'COMMON_ITEM_INSTANCE',
  HELMET_ITEM_INSTANCE = 'HELMET_ITEM_INSTANCE',
  CHEST_ITEM_INSTANCE = 'CHEST_ITEM_INSTANCE',
  ARMOR_ITEM_INSTANCE = 'ARMOR_ITEM_INSTANCE',
  GLOVES_ITEM_INSTANCE = 'GLOVES_ITEM_INSTANCE',
  BOOTS_ITEM_INSTANCE = 'BOOTS_ITEM_INSTANCE',

  SWORD_ITEM_INSTANCE = 'SWORD_ITEM_INSTANCE',
  WEAPON_ITEM_INSTANCE = 'WEAPON_ITEM_INSTANCE',
  AXE_ITEM_INSTANCE = 'AXE_ITEM_INSTANCE',
}

// Utility function to check if an item is a weapon
export function isWeapon(itemType: ItemType): boolean {
  return (
    itemType === ItemType.SWORD_ITEM_INSTANCE ||
    itemType === ItemType.WEAPON_ITEM_INSTANCE ||
    itemType === ItemType.AXE_ITEM_INSTANCE
  );
}

export function getFormattedItemType(value: ItemType): string {
  switch (value) {
    case ItemType.SWORD_ITEM_INSTANCE:
      return 'sword';
    case ItemType.AXE_ITEM_INSTANCE:
      return 'axe';
    default:
      return value; // In case of an invalid enum value
  }
}
