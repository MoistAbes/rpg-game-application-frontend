import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CharacterModel} from '../../models/character-model';
import {ItemInstanceModel} from '../../models/items/instance/Item-instance-model';
import {CharacterApiService} from '../../services/api/character-api.service';
import {CharacterLocalService} from './character-local.service';
import {InventoryApiService} from '../../services/api/inventory-api.service';
import {EquipmentApiService} from '../../services/api/equipment-api.service';
import {InventorySlotModel} from '../../models/inventory-slot-model';
import {ToastrService} from 'ngx-toastr';
import {ItemType} from '../../enums/ItemType';
import {CharacterStatsApiService} from '../../services/api/character-stats-api.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterManagerService {
  private characterSubject = new BehaviorSubject<CharacterModel | null>(null);
  character$ = this.characterSubject.asObservable();

  private draggedItem: { item: ItemInstanceModel; index: number; draggingFrom: string; inventorySlotId: number } | null = null;

  constructor(private characterApiService: CharacterApiService,
              private inventoryApiService: InventoryApiService,
              private equipmentApiService: EquipmentApiService,
              private characterLocalService: CharacterLocalService,
              private characterStatsApiService: CharacterStatsApiService,
              private toastService: ToastrService,) {}


  //DROP EQUIPMENT
  //this runs on drop event in character-stats
  equipDraggedItemToEquipmentSlot(slotType: ItemType, equipmentItemInstance: ItemInstanceModel | undefined) {
    if (!this.draggedItem) return;

    const itemType = this.draggedItem.item.type as ItemType; // Ensure the type is an enum

    //check if item is valid type to equip in this lot
    if (this.isValidSlotForItem(itemType, slotType)) {


      //checking if equipment slot is empty
      if (equipmentItemInstance == null) {
        this.equipmentApiService.equipItemToEmptySlot(this.draggedItem.inventorySlotId, this.getCharacter()!.equipment!.id, slotType)
          .subscribe({
            next: () => {
              this.equipItemToEmptyEquipmentSlot(itemType);
              this.draggedItem = null; // Clear after drop



              //log
              console.log("equipped item to empty equipment slot")

            },
            error: err => console.log(err.message),
            complete: () => this.loadCharacterStats(this.getCharacter()!.id)

          });


      }else {
        //slot is taken attempting swap

        this.equipmentApiService.equipItemToTakenSlot(this.draggedItem.inventorySlotId, this.getCharacter()!.equipment!.id, slotType)
          .subscribe({
            next: () => {
              this.equipItemToTakenEquipmentSlot(itemType);
              this.draggedItem = null; // Clear after drop

              //log
              console.log("equipped item to taken equipment slot")
            },
            error: err => console.log(err.message),
            complete: () => this.loadCharacterStats(this.getCharacter()!.id)
          })



      }

    } else {
      //item type doesnt match equipment slot
      this.toastService.warning("Can't equip on this slot");
    }
  }

  //DROP INVENTORY
  // this runs in character-inventory (drop) method on slot
  equipDraggedItemToInventorySlot(newSlotIndex: number) {
    if (!this.draggedItem) return;
    this.equipItemToInventorySlot(newSlotIndex);
  }

  // Check if the item is valid for the given slot
  private isValidSlotForItem(itemType: ItemType, slotType: ItemType): boolean {
    return itemType === slotType; // Check if the item type matches the slot type
  }

  // Equip item to the correct equipment slot
  private equipItemToEmptyEquipmentSlot(itemType: ItemType) {


    this.equipDraggedItem(itemType)


    // Remove item from inventory after equipping
    this.removeItemFromInventory(this.draggedItem!.index);
  }

  private equipDraggedItem(itemType: ItemType) {
    const currentCharacter: CharacterModel | null = this.getCharacter();
    if (!currentCharacter || !currentCharacter.equipment) return;

    switch (itemType) {
      case ItemType.HELMET_ITEM_INSTANCE: {
        console.log("equipping helmet item: ", this.draggedItem?.item)
        currentCharacter.equipment.helmet = this.draggedItem!.item;
        break;
      }
      case ItemType.CHEST_ITEM_INSTANCE: {
        currentCharacter.equipment.chest = this.draggedItem!.item;
        break;
      }
      case ItemType.GLOVES_ITEM_INSTANCE: {
        currentCharacter.equipment.gloves = this.draggedItem!.item;
        break;
      }
      case ItemType.BOOTS_ITEM_INSTANCE: {
        currentCharacter.equipment.boots = this.draggedItem!.item;
        break;
      }
      default: {
        this.toastService.warning("Cannot equip this item here");
        return;
      }
    }

    // Update the character after equipping
    this.updateCharacter({ equipment: currentCharacter.equipment });
  }

  private equipInventoryItem(inventoryItemInstance: ItemInstanceModel | undefined) {
    const currentCharacter: CharacterModel | null = this.getCharacter();
    if (!currentCharacter || !currentCharacter.equipment) return;

    switch (inventoryItemInstance?.type) {
      case ItemType.HELMET_ITEM_INSTANCE: {
        console.log("equipping helmet item: ", inventoryItemInstance)
        currentCharacter.equipment.helmet = inventoryItemInstance;
        break;
      }
      case ItemType.CHEST_ITEM_INSTANCE: {
        currentCharacter.equipment.chest = inventoryItemInstance;
        break;
      }
      case ItemType.GLOVES_ITEM_INSTANCE: {
        currentCharacter.equipment.gloves = inventoryItemInstance;
        break;
      }
      case ItemType.BOOTS_ITEM_INSTANCE: {
        currentCharacter.equipment.boots = inventoryItemInstance;
        break;
      }
      default: {
        this.toastService.warning("Cannot equip this item here");
        return;
      }
    }

    // Update the character after equipping
    this.updateCharacter({ equipment: currentCharacter.equipment });
  }

  // Equip item to the correct equipment slot
  private equipItemToTakenEquipmentSlot(itemType: ItemType) {
    const currentCharacter = this.getCharacter();
    if (!currentCharacter || !currentCharacter.equipment) return;


    switch (itemType) {
      case ItemType.HELMET_ITEM_INSTANCE: {
        currentCharacter.inventory!.inventorySlots[this.draggedItem!.index].itemInstance = currentCharacter.equipment.helmet ?? null
        currentCharacter.equipment.helmet = this.draggedItem!.item;
        break;
      }
      case ItemType.CHEST_ITEM_INSTANCE: {
        currentCharacter.inventory!.inventorySlots[this.draggedItem!.index].itemInstance = currentCharacter.equipment.chest ?? null
        currentCharacter.equipment.chest = this.draggedItem!.item;
        break;
      }
      case ItemType.GLOVES_ITEM_INSTANCE: {
        currentCharacter.inventory!.inventorySlots[this.draggedItem!.index].itemInstance = currentCharacter.equipment.gloves ?? null
        currentCharacter.equipment.gloves = this.draggedItem!.item;
        break;
      }
      case ItemType.BOOTS_ITEM_INSTANCE: {
        currentCharacter.inventory!.inventorySlots[this.draggedItem!.index].itemInstance = currentCharacter.equipment.boots ?? null
        currentCharacter.equipment.boots = this.draggedItem!.item;
        break;
      }
      default: {
        this.toastService.warning("Cannot equip this item here");
        return;
      }
    }

    // Update the character after equipping
    this.updateCharacter({ equipment: currentCharacter.equipment });
    this.updateCharacter({ inventory: currentCharacter.inventory });

  }

  private equipItemToInventorySlot(newSlotIndex: number) {
    const currentCharacter = this.getCharacter();
    if (!currentCharacter || !currentCharacter.inventory || !this.draggedItem) return;

    const prevIndex: number = this.draggedItem.index;
    const isFromEquipment: boolean = this.draggedItem.draggingFrom === 'equipment';

    const targetSlot = currentCharacter.inventory.inventorySlots[newSlotIndex];
    const targetItem = targetSlot.itemInstance;

    //checking if dragged item is comming from equipment or inventory
    if (isFromEquipment) {
      //dragged item is comming from equipment
      console.log("equipment to inventory swap")
      this.handleEquipmentToInventorySwap(currentCharacter, targetSlot, targetItem);
    } else {
      //dragged item is comming from inventory
      this.handleInventoryToInventorySwap(currentCharacter, prevIndex, newSlotIndex);
    }

    // this.updateCharacter({ equipment: currentCharacter.equipment });
  }

  // Handle equipping an item from equipment into inventory
  private handleEquipmentToInventorySwap(currentCharacter: CharacterModel, targetSlot: InventorySlotModel, targetItem: ItemInstanceModel | null) {

    //checking if inventory slot is taken
    if (targetItem) {
      console.log("inventory slot is taken")

      //check if items are of matching type
      if (this.isSameEquipmentType(this.draggedItem!.item, targetItem)) {
        console.log("items are of matching type")

        //call api
        this.equipmentApiService.unequipItemToTakenSlot(targetSlot.id, this.getCharacter()!.equipment!.id, this.draggedItem!.item.type)
          .subscribe({
            next: () => {
              //swap items
              this.swapWithEquipment(currentCharacter, targetItem, targetSlot);
              console.log("equipment after swap: ", currentCharacter.equipment)
              console.log("inventory after swap: ", currentCharacter.inventory)


            },
            error: err => console.log(err.message),
            complete: () => this.loadCharacterStats(this.getCharacter()!.id)

          });

      } else {
        this.toastService.warning("Cannot equip this item here");
      }
    } else {
      //inventory slot is empty


      // Call API to remove item from equipment
      this.equipmentApiService
        .unequipItemToEmptySlot(targetSlot.id, currentCharacter.equipment!.id, this.draggedItem!.item.type)
        .subscribe({
          next: () => {
            //unequip item to inventory
            this.removeItemFromEquipment(this.draggedItem!.item.type);
            targetSlot.itemInstance = this.draggedItem!.item;


          },
          error: err => console.log(err.message),
          complete: () => this.loadCharacterStats(currentCharacter.id)

        });
    }
  }

  // Handle swapping items within inventory
  private handleInventoryToInventorySwap(currentCharacter: CharacterModel, prevIndex: number, newSlotIndex: number) {

    if (!currentCharacter.inventory) {
      console.warn("Inventory is undefined. Cannot swap items.");
      return; // Prevents runtime errors
    }

    this.inventoryApiService.moveItem(prevIndex, newSlotIndex, currentCharacter.id).subscribe({
      next: () => {

      },
      error: () => {
        console.log("Something went wrong while trying to swap items in inventory")
      },
      complete: () => {
        const prevSlot = currentCharacter.inventory!.inventorySlots[prevIndex];
        const newSlot = currentCharacter.inventory!.inventorySlots[newSlotIndex];

        [prevSlot.itemInstance, newSlot.itemInstance] = [newSlot.itemInstance, prevSlot.itemInstance]; // Swap items
        this.updateCharacter({ equipment: currentCharacter.equipment });

      }
    })
  }

  // checks if 2 items are of the same type
  private isSameEquipmentType(itemA: ItemInstanceModel, itemB: ItemInstanceModel): boolean {
    if (!itemA || !itemB) return false;

    const equipmentMapping: Record<ItemType, ItemType> = {
      [ItemType.HELMET_ITEM_INSTANCE]: ItemType.HELMET_ITEM_INSTANCE,
      [ItemType.BOOTS_ITEM_INSTANCE]: ItemType.BOOTS_ITEM_INSTANCE,
      [ItemType.GLOVES_ITEM_INSTANCE]: ItemType.GLOVES_ITEM_INSTANCE,
      [ItemType.CHEST_ITEM_INSTANCE]: ItemType.CHEST_ITEM_INSTANCE,
      [ItemType.ARMOR_ITEM_INSTANCE]: ItemType.ARMOR_ITEM_INSTANCE,
      [ItemType.COMMON_ITEM_INSTANCE]: ItemType.COMMON_ITEM_INSTANCE,
      // Add other equipment mappings here
    };

    return equipmentMapping[itemA.type as ItemType] === (itemB.type as ItemType);
  }

// Swap an inventory item with equipment
  private swapWithEquipment(currentCharacter: CharacterModel, inventoryItem: ItemInstanceModel, inventorySlot: InventorySlotModel) {


    //replace equipment item with item from inventory
    this.equipInventoryItem(inventoryItem)

    //add to inventory previously equipped item
    currentCharacter.inventory!.inventorySlots[inventorySlot.position].itemInstance = this.draggedItem?.item ?? null
    this.draggedItem = null; // Clear after drop




  }

  /** Remove item from inventory */
  private removeItemFromInventory(inventorySlotIndex: number) {
    const currentCharacter = this.getCharacter();
    if (!currentCharacter || !currentCharacter.inventory) return;

    currentCharacter.inventory.inventorySlots[inventorySlotIndex].itemInstance = null;
    const updatedInventory = { ...currentCharacter.inventory};
    this.updateCharacter({ inventory: updatedInventory });
  }

  /** Remove item from equipment */
  private removeItemFromEquipment(slotType: string) {
    const currentCharacter = this.getCharacter();
    if (!currentCharacter || !currentCharacter.equipment) return;


    switch (slotType) {
      case ItemType.HELMET_ITEM_INSTANCE : {
        currentCharacter.equipment.helmet = undefined;
        break;
      }
      case ItemType.CHEST_ITEM_INSTANCE : {
        currentCharacter.equipment.chest = undefined;
        break;
      }
      case ItemType.GLOVES_ITEM_INSTANCE : {
        currentCharacter.equipment.gloves = undefined;
        break;
      }
      case ItemType.BOOTS_ITEM_INSTANCE : {
        currentCharacter.equipment.boots = undefined;
        break;
      }
    }

  }

  /** Update the character state */
  private updateCharacter(updatedData: Partial<CharacterModel>) {
    const currentCharacter = this.getCharacter();
    if (!currentCharacter) return;

    const updatedCharacter = { ...currentCharacter, ...updatedData };
    this.characterSubject.next(updatedCharacter);
  }

  /** Load character with inventory and equipment */
  loadCharacter() {

    this.characterApiService.getCharacter(this.characterLocalService.getId()).subscribe({
      next: character => {
        console.log("loaded character: ", character)
        this.characterSubject.next(character); // Set initial character
        this.loadInventory();
        this.loadEquipment();

      },
      error: err => console.log('Error loading character:', err)
    });
  }

  /** Load inventory separately */
  private loadInventory() {
    this.inventoryApiService.getInventory(this.characterLocalService.getId()).subscribe({
      next: inventory => {
        this.updateCharacter({ inventory }); // Merge inventory into character

        console.log("inventory: ", inventory)
      },
      error: err => console.log('Error loading inventory:', err)
    });
  }

  /** Load equipment separately */
  private loadEquipment() {
    this.equipmentApiService.getCharacterEquipment(this.characterLocalService.getId()).subscribe({
      next: equipment => {
        this.updateCharacter({ equipment }); // Merge equipment into character

        console.log("equipment: ", equipment);
      },
      error: err => console.log('Error loading equipment:', err)
    });
  }

  private loadCharacterStats(characterId: number) {
    this.characterStatsApiService.getCharacterStats(characterId).subscribe({
      next: characterStats => {
        this.updateCharacter({ characterStats });
      }
    })
  }

  /** Get the current character */
  getCharacter(): CharacterModel | null {
    return this.characterSubject.value;
  }

  setDraggedItem(item: ItemInstanceModel, index: number, draggingFrom: string, inventorySlotId: number) {
    this.draggedItem = { item, index, draggingFrom, inventorySlotId };
  }

  getDraggedItem() {
    return this.draggedItem
  }
}
