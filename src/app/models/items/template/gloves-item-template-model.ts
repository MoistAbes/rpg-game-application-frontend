import {ItemTemplate} from './item-template';

export class GlovesItemTemplateModel extends ItemTemplate{
  baseAmountOfBonusStats: number = 0;

  override getItemType(): string {
    return "gloves";
  }

}
