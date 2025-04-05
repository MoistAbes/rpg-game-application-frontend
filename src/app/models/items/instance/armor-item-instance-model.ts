import {EquipmentItemInstanceModel} from './equipment-item-instance-model';
import {ArmorTypeEnum} from '../../../enums/armor-type-enum';

export class ArmorItemInstanceModel extends EquipmentItemInstanceModel{
  armorValue: number | undefined;
  armorType: ArmorTypeEnum | undefined;
}
