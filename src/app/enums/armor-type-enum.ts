export enum ArmorTypeEnum {
  ROBE_ARMOR = 'ROBE_ARMOR',
  LIGHT_ARMOR = 'LIGHT_ARMOR',
  MEDIUM_ARMOR = 'MEDIUM_ARMOR',
  HEAVY_ARMOR = 'HEAVY_ARMOR',


}

// Utility function to return formatted value
export function getFormattedArmorType(value: ArmorTypeEnum): string {
  switch (value) {
    case ArmorTypeEnum.ROBE_ARMOR:
      return 'robe armor';
    case ArmorTypeEnum.LIGHT_ARMOR:
      return 'light armor';
    case ArmorTypeEnum.MEDIUM_ARMOR:
      return 'medium armor';
    case ArmorTypeEnum.HEAVY_ARMOR:
      return 'heavy armor';
    default:
      return value; // In case of an invalid enum value
  }
}
