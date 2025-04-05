import {ItemInstanceModel} from './Item-instance-model';
import {ItemRarityEnum} from '../../../enums/item-rarity-enum';

export class EquipmentItemInstanceModel extends ItemInstanceModel{
  quality: number | undefined;
  levelRequirement: number | undefined;


}
