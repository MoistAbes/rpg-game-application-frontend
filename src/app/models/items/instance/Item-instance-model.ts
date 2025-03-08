import {ItemRarity} from '../../../enums/ItemRarity';
import {ItemStatsModel} from '../item-stats-model';
import {ItemType} from '../../../enums/ItemType';

export class ItemInstanceModel {
  id: number = 0;
  quantity: number | undefined;
  // type:string = "";
  type:ItemType | undefined;
  itemRarity: ItemRarity | undefined;
  itemStats: ItemStatsModel[] = []


}
