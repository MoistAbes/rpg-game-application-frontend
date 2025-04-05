import {ArmorTypeEnum} from './armor-type-enum';

export enum WeaponTypeEnum {

  ONE_HAND = 'ONE_HAND',
  TWO_HAND = 'TWO_HAND',

}


export function getFormattedWeaponType(value: WeaponTypeEnum): string {
  switch (value) {
    case WeaponTypeEnum.ONE_HAND:
      return 'one-handed';
    case WeaponTypeEnum.TWO_HAND:
      return 'two-handed';

    default:
      return value; // In case of an invalid enum value
  }
}
