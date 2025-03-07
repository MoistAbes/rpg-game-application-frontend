export enum ItemRarity {
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
}

export function getFormattedItemRarity(value: ItemRarity): string {
  switch (value) {
    case ItemRarity.COMMON:
      return 'Common';
    case ItemRarity.RARE:
      return 'Rare';
    case ItemRarity.EPIC:
      return 'Epic';
    case ItemRarity.LEGENDARY:
      return 'Legendary';
    default:
      return value; // In case of an invalid enum value
  }
}
