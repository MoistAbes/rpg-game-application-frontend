export enum ItemRarityEnum {
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
}

export function getFormattedItemRarity(value: ItemRarityEnum): string {
  switch (value) {
    case ItemRarityEnum.COMMON:
      return 'Common';
    case ItemRarityEnum.RARE:
      return 'Rare';
    case ItemRarityEnum.EPIC:
      return 'Epic';
    case ItemRarityEnum.LEGENDARY:
      return 'Legendary';
    default:
      return value; // In case of an invalid enum value
  }
}
