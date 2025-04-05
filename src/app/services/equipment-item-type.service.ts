import { Injectable } from '@angular/core';
import {ItemInstanceModel} from '../models/items/instance/Item-instance-model';
import {EquipmentItemInstanceModel} from '../models/items/instance/equipment-item-instance-model';

@Injectable({
  providedIn: 'root'
})
export class EquipmentItemTypeService {

  constructor() { }



  private isEquipmentItemInstance(item: ItemInstanceModel): item is EquipmentItemInstanceModel {
    return (item as EquipmentItemInstanceModel).levelRequirement !== undefined;
  }

  public getRequirementLevel(itemInstance: ItemInstanceModel): number {
    if (this.isEquipmentItemInstance(itemInstance)) {
      return itemInstance.levelRequirement || 0
    }
    return 0;
  }

}
