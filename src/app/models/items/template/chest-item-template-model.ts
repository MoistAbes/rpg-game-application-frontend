import {ItemTemplate} from './item-template';

export class ChestItemTemplateModel extends ItemTemplate{
  baseAmountOfBonusStats: number = 0;

  getItemType(): string {
    return 'chest';
  }
}
