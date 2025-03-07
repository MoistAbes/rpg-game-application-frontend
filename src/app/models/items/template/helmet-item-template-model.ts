import {ItemTemplate} from './item-template';

export class HelmetItemTemplateModel extends ItemTemplate{
  baseAmountOfBonusStats: number = 0;

  getItemType(): string {
    return 'Helmet';
  }
}
