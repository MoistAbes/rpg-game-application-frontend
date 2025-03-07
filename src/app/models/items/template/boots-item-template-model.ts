import {ItemTemplate} from './item-template';

export class BootsItemTemplateModel extends ItemTemplate {
  baseAmountOfBonusStats: number = 0;

  getItemType(): string {
    return 'boots';
  }
}
