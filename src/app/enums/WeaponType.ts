import {ArmorType} from './ArmorType';

export enum WeaponType {

  ONE_HAND = 'ONE_HAND',
  TWO_HAND = 'TWO_HAND',

}


export function getFormattedWeaponType(value: WeaponType): string {
  switch (value) {
    case WeaponType.ONE_HAND:
      return 'one-handed';
    case WeaponType.TWO_HAND:
      return 'two-handed';

    default:
      return value; // In case of an invalid enum value
  }
}
