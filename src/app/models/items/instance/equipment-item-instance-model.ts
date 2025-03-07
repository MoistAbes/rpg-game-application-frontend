import {ItemInstanceModel} from './Item-instance-model';
import {ItemRarity} from '../../../enums/ItemRarity';

export class EquipmentItemInstanceModel extends ItemInstanceModel{
  quality: number | undefined;
  levelRequirement: number | undefined;


}
