import {ItemRarityEnum} from '../../../enums/item-rarity-enum';
import {ItemStatsModel} from '../item-stats-model';
import {ItemTypeEnum} from '../../../enums/item-type-enum';

export class ItemInstanceModel {
  id: number = 0;
  quantity: number | undefined;
  // type:string = "";
  type:ItemTypeEnum | undefined;
  itemRarity: ItemRarityEnum | undefined;
  itemStats: ItemStatsModel[] = []

}
