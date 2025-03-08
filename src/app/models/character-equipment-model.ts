import {HelmetItemInstanceModel} from './items/instance/helmet-item-instance-model';
import {ItemInstanceModel} from './items/instance/Item-instance-model';

export class CharacterEquipmentModel {
  id: number = 0;
  helmet: ItemInstanceModel | undefined;
  chest: ItemInstanceModel | undefined;
  gloves: ItemInstanceModel | undefined;
  boots: ItemInstanceModel | undefined;
  mainHand: ItemInstanceModel | undefined;
}
