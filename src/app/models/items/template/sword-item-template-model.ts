import {WeaponItemTemplate} from './weapon-item-template';

export class SwordItemTemplateModel extends WeaponItemTemplate {


  override getItemType(): string {
    return 'Sword';
  }
}
