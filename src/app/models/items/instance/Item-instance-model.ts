import {ItemRarity} from '../../../enums/ItemRarity';
import {ItemStatsModel} from '../item-stats-model';

export class ItemInstanceModel {
  id: number = 0;
  quantity: number | undefined;
  type:string = "";
  itemRarity: ItemRarity | undefined;
  itemStats: ItemStatsModel[] = []


}
