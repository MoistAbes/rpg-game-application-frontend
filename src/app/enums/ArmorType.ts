export enum ArmorType {
  ROBE_ARMOR = 'ROBE_ARMOR',
  LIGHT_ARMOR = 'LIGHT_ARMOR',
  MEDIUM_ARMOR = 'MEDIUM_ARMOR',
  HEAVY_ARMOR = 'HEAVY_ARMOR',


}

// Utility function to return formatted value
export function getFormattedArmorType(value: ArmorType): string {
  switch (value) {
    case ArmorType.ROBE_ARMOR:
      return 'robe armor';
    case ArmorType.LIGHT_ARMOR:
      return 'light armor';
    case ArmorType.MEDIUM_ARMOR:
      return 'medium armor';
    case ArmorType.HEAVY_ARMOR:
      return 'heavy armor';
    default:
      return value; // In case of an invalid enum value
  }
}
