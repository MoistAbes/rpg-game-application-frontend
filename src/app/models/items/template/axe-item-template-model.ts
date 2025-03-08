import {WeaponItemTemplate} from './weapon-item-template';

export class AxeItemTemplateModel extends WeaponItemTemplate {
  override getItemType(): string {
    return 'Axe';
  }
}
