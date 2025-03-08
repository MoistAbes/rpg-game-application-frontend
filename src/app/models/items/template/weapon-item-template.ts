import {ItemTemplate} from './item-template';
import {WeaponType} from '../../../enums/WeaponType';

export class WeaponItemTemplate extends ItemTemplate{

  weaponType: WeaponType | undefined;

  getItemType(): string {
    return "";
  }


}
