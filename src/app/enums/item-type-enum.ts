import {WeaponTypeEnum} from './weapon-type-enum';

export enum ItemTypeEnum {
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
export function isWeapon(itemType: ItemTypeEnum | undefined): boolean {
  if  (itemType == undefined){
    return false;
  }

  return (
    itemType === ItemTypeEnum.SWORD_ITEM_INSTANCE ||
    itemType === ItemTypeEnum.WEAPON_ITEM_INSTANCE ||
    itemType === ItemTypeEnum.AXE_ITEM_INSTANCE
  );
}

export function getFormattedItemType(value: ItemTypeEnum): string {
  switch (value) {
    case ItemTypeEnum.SWORD_ITEM_INSTANCE:
      return 'sword';
    case ItemTypeEnum.AXE_ITEM_INSTANCE:
      return 'axe';
    default:
      return value; // In case of an invalid enum value
  }
}
