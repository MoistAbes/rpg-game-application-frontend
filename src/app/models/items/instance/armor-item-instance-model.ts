import {EquipmentItemInstanceModel} from './equipment-item-instance-model';
import {ArmorType} from '../../../enums/ArmorType';

export class ArmorItemInstanceModel extends EquipmentItemInstanceModel{
  armorValue: number | undefined;
  armorType: ArmorType | undefined;
}
