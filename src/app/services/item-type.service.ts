import {Injectable} from '@angular/core';
import {ItemInstanceModel} from '../models/items/instance/Item-instance-model';
import {HelmetItemInstanceModel} from '../models/items/instance/helmet-item-instance-model';
import {CommonItemInstanceModel} from '../models/items/instance/common-item-instance-model';
import {ChestItemInstanceModel} from '../models/items/instance/chest-item-instance-model';
import {ItemTypeEnum} from '../enums/item-type-enum';
import {ItemTemplate} from '../models/items/template/item-template';
import {GlovesItemInstanceModel} from '../models/items/instance/gloves-item-instance-model';
import {BootsItemInstanceModel} from '../models/items/instance/boots-item-instance-model';
import {ArmorItemInstanceModel} from '../models/items/instance/armor-item-instance-model';
import {EquipmentItemInstanceModel} from '../models/items/instance/equipment-item-instance-model';
import {ItemRarityEnum} from '../enums/item-rarity-enum';
import {ArmorTypeEnum} from '../enums/armor-type-enum';
import {SwordItemInstanceModel} from '../models/items/instance/sword-item-instance-model';
import {WeaponItemInstanceModel} from '../models/items/instance/weapon-item-instance-model';
import {AxeItemInstanceModel} from '../models/items/instance/axe-item-instance-model';
import {WeaponItemTemplate} from '../models/items/template/weapon-item-template';
import {WeaponTypeEnum} from '../enums/weapon-type-enum';

@Injectable({
  providedIn: 'root'
})
export class ItemTypeService {

  constructor() { }


  private getItemProperty<T extends keyof ItemTemplate>(
    itemInstance: ItemInstanceModel | undefined,
    property: T,
    defaultValue: string
  ): string {
    if (!itemInstance) return defaultValue;

    let value: unknown;

    switch (itemInstance.type) {
      case ItemTypeEnum.COMMON_ITEM_INSTANCE:
        value = (itemInstance as CommonItemInstanceModel).commonItemTemplate[property];
        break;
      case ItemTypeEnum.HELMET_ITEM_INSTANCE:
        value = (itemInstance as HelmetItemInstanceModel).helmetTemplate![property];
        break;
      case ItemTypeEnum.CHEST_ITEM_INSTANCE:
        value = (itemInstance as ChestItemInstanceModel).chestTemplate![property];
        break;
      case ItemTypeEnum.GLOVES_ITEM_INSTANCE:
        value = (itemInstance as GlovesItemInstanceModel).glovesTemplate![property];
        break;
      case ItemTypeEnum.BOOTS_ITEM_INSTANCE:
        value = (itemInstance as BootsItemInstanceModel).bootsTemplate![property];
        break;
      case ItemTypeEnum.SWORD_ITEM_INSTANCE:
        value = (itemInstance as SwordItemInstanceModel).swordTemplate![property];
        break;
      case ItemTypeEnum.AXE_ITEM_INSTANCE:
        value = (itemInstance as AxeItemInstanceModel).axeTemplate![property];
        break;
      default:
        console.error(`Unknown type: ${itemInstance.type}`);
        return defaultValue;
    }

    return typeof value === 'string' ? value : defaultValue;
  }

  private getWeaponProperty<T extends keyof WeaponItemTemplate>(
    itemInstance: ItemInstanceModel | undefined,
    property: T,
    defaultValue: string
  ): string {
    if (!itemInstance) return defaultValue;

    let value: unknown;

    switch (itemInstance.type) {
      case ItemTypeEnum.SWORD_ITEM_INSTANCE:
        value = (itemInstance as SwordItemInstanceModel).swordTemplate![property];
        break;
      case ItemTypeEnum.AXE_ITEM_INSTANCE:
        value = (itemInstance as AxeItemInstanceModel).axeTemplate![property];
        break;
      default:
        console.error(`Unknown type: ${itemInstance.type}`);
        return defaultValue;
    }

    return typeof value === 'string' ? value : defaultValue;
  }


  public getItemRarity(itemInstance: ItemInstanceModel | undefined): ItemRarityEnum | undefined {
    if (!itemInstance) return undefined;
    return (itemInstance as EquipmentItemInstanceModel).itemRarity
  }


  public getArmorValueProperty(itemInstance: ItemInstanceModel): number {

    let armorValue: number | undefined;
    armorValue = (itemInstance as ArmorItemInstanceModel).armorValue

    if (armorValue) {
      return armorValue
    }else {
      return 0
    }

  }

  public getDamageValueProperty(itemInstance: ItemInstanceModel): number {

    let damageValue: number | undefined;
    damageValue = (itemInstance as WeaponItemInstanceModel).damageValue

    if (damageValue) {
      return damageValue
    }else {
      return 0
    }

  }

  getItemIconPath(itemInstance: ItemInstanceModel): string {
    //ToDO tutaj dalem na default punching hand pewnie trzeba to bedzie zmienic zeby tylko do weapon to lecialo
    return this.getItemProperty(itemInstance, 'iconPath', 'punching-hand.svg');
  }

  getItemName(itemInstance: ItemInstanceModel | undefined): string {
    return this.getItemProperty(itemInstance, 'name', 'no item name found');
  }

  getItemDescription(itemInstance: ItemInstanceModel): string {
    return this.getItemProperty(itemInstance, 'description', 'no item description found');
  }

  getItemArmorType(itemInstance: ItemInstanceModel): ArmorTypeEnum {
    // console.log("get item armor type: ", itemInstance);
    return (itemInstance as ArmorItemInstanceModel).armorType! as ArmorTypeEnum
  }

  getWeaponType(itemInstance: ItemInstanceModel): WeaponTypeEnum {
    return this.getWeaponProperty(itemInstance, 'weaponType', 'no weapon type found') as WeaponTypeEnum;

  }



}
