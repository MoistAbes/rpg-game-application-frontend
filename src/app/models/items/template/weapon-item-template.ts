import {ItemTemplate} from './item-template';
import {WeaponTypeEnum} from '../../../enums/weapon-type-enum';

export class WeaponItemTemplate extends ItemTemplate{

  weaponType: WeaponTypeEnum | undefined;

  getItemType(): string {
    return "";
  }


}
