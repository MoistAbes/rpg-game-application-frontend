import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ItemInstanceModel} from '../../models/items/instance/Item-instance-model';
import {CharacterApiService} from '../../services/api/character-api.service';
import {InventoryApiService} from '../../services/api/inventory-api.service';
import {EquipmentApiService} from '../../services/api/equipment-api.service';
import {ToastrService} from 'ngx-toastr';
import {isWeapon, ItemTypeEnum} from '../../enums/item-type-enum';
import {CharacterStatsApiService} from '../../services/api/character-stats-api.service';
import {EquipmentItemTypeService} from '../../services/equipment-item-type.service';
import {CharacterModel} from '../../models/character/character-model';
import {InventorySlotModel} from '../../models/character/inventory-slot-model';
import {JwtService} from './jwt.service';

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
              // private characterLocalService: CharacterLocalService,
              private jwtService: JwtService,
              private characterStatsApiService: CharacterStatsApiService,
              private equipmentItemTypeService: EquipmentItemTypeService,
              private toastService: ToastrService,) {}


  //DROP EQUIPMENT
  //this runs on drop event in character-stats
  public equipDraggedItemToEquipmentSlot(slotType: ItemTypeEnum, equipmentItemInstance: ItemInstanceModel | undefined) {
    if (!this.draggedItem) return;

    const itemType = this.draggedItem.item.type as ItemTypeEnum; // Ensure the type is an enum

    //check if item is valid type to equip in this lot
    if (this.isItemAbleToBeEquipped(this.draggedItem.item, slotType)) {

      //checking if equipment slot is empty
      if (equipmentItemInstance == null) {
        this.equipmentApiService.equipItemToEmptySlot(this.draggedItem.inventorySlotId, this.getCharacter()!.equipment!.id, slotType)
          .subscribe({
            next: () => {
              this.equipItemToEmptyEquipmentSlot(itemType);
              this.draggedItem = null; // Clear after drop


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
  public equipDraggedItemToInventorySlot(newSlotIndex: number) {
    if (!this.draggedItem) return;
    this.equipItemToInventorySlot(newSlotIndex);
  }

  //remove item from inventory
  public deleteItemFromInventory(slot: InventorySlotModel): void {
    this.inventoryApiService.deleteItemFromInventory(slot.id ,slot.itemInstance!.id).subscribe({
      next: () => {},
      error: err => {},
      complete: () => {
        this.removeItemFromInventory(slot.position)
      }
    })
  }



  // Equip item to the correct equipment slot
  private equipItemToEmptyEquipmentSlot(itemType: ItemTypeEnum) {


    this.equipDraggedItem(itemType)


    // Remove item from inventory after equipping
    this.removeItemFromInventory(this.draggedItem!.index);
  }

  private equipDraggedItem(itemType: ItemTypeEnum) {
    const currentCharacter: CharacterModel | null = this.getCharacter();
    if (!currentCharacter || !currentCharacter.equipment) return;

    //check if its weapon
    if (isWeapon(itemType)){
      itemType = ItemTypeEnum.WEAPON_ITEM_INSTANCE
    }

    switch (itemType) {
      case ItemTypeEnum.HELMET_ITEM_INSTANCE: {
        currentCharacter.equipment.helmet = this.draggedItem!.item;
        break;
      }
      case ItemTypeEnum.CHEST_ITEM_INSTANCE: {
        currentCharacter.equipment.chest = this.draggedItem!.item;
        break;
      }
      case ItemTypeEnum.GLOVES_ITEM_INSTANCE: {
        currentCharacter.equipment.gloves = this.draggedItem!.item;
        break;
      }
      case ItemTypeEnum.BOOTS_ITEM_INSTANCE: {
        currentCharacter.equipment.boots = this.draggedItem!.item;
        break;
      }
      case ItemTypeEnum.WEAPON_ITEM_INSTANCE: {
        currentCharacter.equipment.mainHand = this.draggedItem!.item;
        break;
      }
      default: {
        this.toastService.warning("Cannot equip this item here: ", itemType);
        return;
      }
    }

    // Update the character after equipping
    this.updateCharacter({ equipment: currentCharacter.equipment });
  }

  private equipInventoryItem(inventoryItemInstance: ItemInstanceModel | undefined) {
    const currentCharacter: CharacterModel | null = this.getCharacter();
    if (!currentCharacter || !currentCharacter.equipment) return;


    //check if item type belongs to weapons
    let inventoryItemType: ItemTypeEnum = inventoryItemInstance!.type!;
    if (isWeapon(inventoryItemType)) {
      inventoryItemType = ItemTypeEnum.WEAPON_ITEM_INSTANCE
    }

    switch (inventoryItemType) {
      case ItemTypeEnum.HELMET_ITEM_INSTANCE: {
        currentCharacter.equipment.helmet = inventoryItemInstance;
        break;
      }
      case ItemTypeEnum.CHEST_ITEM_INSTANCE: {
        currentCharacter.equipment.chest = inventoryItemInstance;
        break;
      }
      case ItemTypeEnum.GLOVES_ITEM_INSTANCE: {
        currentCharacter.equipment.gloves = inventoryItemInstance;
        break;
      }
      case ItemTypeEnum.BOOTS_ITEM_INSTANCE: {
        currentCharacter.equipment.boots = inventoryItemInstance;
        break;
      }
      case ItemTypeEnum.WEAPON_ITEM_INSTANCE: {
        currentCharacter.equipment.mainHand = inventoryItemInstance;
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
  private equipItemToTakenEquipmentSlot(itemType: ItemTypeEnum) {
    const currentCharacter = this.getCharacter();
    if (!currentCharacter || !currentCharacter.equipment) return;



    //check if its weapon type
    if (isWeapon(itemType)) {
      itemType = ItemTypeEnum.WEAPON_ITEM_INSTANCE
    }

    switch (itemType) {
      case ItemTypeEnum.HELMET_ITEM_INSTANCE: {
        currentCharacter.inventory!.inventorySlots[this.draggedItem!.index].itemInstance = currentCharacter.equipment.helmet ?? null
        currentCharacter.equipment.helmet = this.draggedItem!.item;
        break;
      }
      case ItemTypeEnum.CHEST_ITEM_INSTANCE: {
        currentCharacter.inventory!.inventorySlots[this.draggedItem!.index].itemInstance = currentCharacter.equipment.chest ?? null
        currentCharacter.equipment.chest = this.draggedItem!.item;
        break;
      }
      case ItemTypeEnum.GLOVES_ITEM_INSTANCE: {
        currentCharacter.inventory!.inventorySlots[this.draggedItem!.index].itemInstance = currentCharacter.equipment.gloves ?? null
        currentCharacter.equipment.gloves = this.draggedItem!.item;
        break;
      }
      case ItemTypeEnum.BOOTS_ITEM_INSTANCE: {
        currentCharacter.inventory!.inventorySlots[this.draggedItem!.index].itemInstance = currentCharacter.equipment.boots ?? null
        currentCharacter.equipment.boots = this.draggedItem!.item;
        break;
      }
      case ItemTypeEnum.WEAPON_ITEM_INSTANCE: {
        currentCharacter.inventory!.inventorySlots[this.draggedItem!.index].itemInstance = currentCharacter.equipment.mainHand ?? null
        currentCharacter.equipment.mainHand = this.draggedItem!.item;
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
      this.handleEquipmentToInventorySwap(currentCharacter, targetSlot, targetItem);
    } else {
      //dragged item is comming from inventory
      this.handleInventoryToInventorySwap(currentCharacter, prevIndex, newSlotIndex);
    }

    // this.updateCharacter({ equipment: currentCharacter.equipment });
  }

  // Handle equipping an item from equipment into inventory
  private handleEquipmentToInventorySwap(currentCharacter: CharacterModel, targetSlot: InventorySlotModel, targetItem: ItemInstanceModel | null) {

    //check if its weapon type
    let draggedItemType = this.draggedItem!.item.type!;
    if (isWeapon(draggedItemType)){
      draggedItemType = ItemTypeEnum.WEAPON_ITEM_INSTANCE
    }

    //checking if inventory slot is taken
    if (targetItem) {

      if (this.isItemAbleToBeEquipped(targetItem, this.draggedItem?.item.type!)) {

        //check level requirement
        if (this.equipmentItemTypeService.getRequirementLevel(targetItem) > this.characterSubject!.value!.level){
          this.toastService.warning("Level is too low to equip this item")
          return;
        }

        //call api
        this.equipmentApiService.unequipItemToTakenSlot(targetSlot.id, this.getCharacter()!.equipment!.id, draggedItemType.toString())
          .subscribe({
            next: () => {
              //swap items
              this.swapWithEquipment(currentCharacter, targetItem, targetSlot);

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
        .unequipItemToEmptySlot(targetSlot.id, currentCharacter.equipment!.id, draggedItemType.toString())
        .subscribe({
          next: () => {
            //unequip item to inventory
            this.removeItemFromEquipment(draggedItemType.toString());
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

    this.inventoryApiService.moveItem(prevIndex, newSlotIndex, currentCharacter.inventory.id).subscribe({
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


  private isItemAbleToBeEquipped(itemToBeEquipped: ItemInstanceModel | undefined, slotType: ItemTypeEnum | undefined): boolean {
    if (!itemToBeEquipped || !slotType) return false;

    let isSameType: boolean = false;

    // Check if both items are weapons
    if (isWeapon(itemToBeEquipped.type!) && isWeapon(slotType!)) {
      isSameType = true;
    }

    //check if items are of the same type
    if (itemToBeEquipped.type === slotType) {
      isSameType = true
    }

    //if items are the same type
    if (isSameType) {

      //check level requirement
      if (this.equipmentItemTypeService.getRequirementLevel(itemToBeEquipped) > this.characterSubject!.value!.level){
        this.toastService.warning("Level is too low to equip this item")
        return false;
      }


      return true;

    }else {
      return false;
    }

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
      case ItemTypeEnum.HELMET_ITEM_INSTANCE : {
        currentCharacter.equipment.helmet = undefined;
        break;
      }
      case ItemTypeEnum.CHEST_ITEM_INSTANCE : {
        currentCharacter.equipment.chest = undefined;
        break;
      }
      case ItemTypeEnum.GLOVES_ITEM_INSTANCE : {
        currentCharacter.equipment.gloves = undefined;
        break;
      }
      case ItemTypeEnum.BOOTS_ITEM_INSTANCE : {
        currentCharacter.equipment.boots = undefined;
        break;
      }
      case ItemTypeEnum.WEAPON_ITEM_INSTANCE : {
        currentCharacter.equipment.mainHand = undefined;
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
  public loadCharacter() {

    this.characterApiService.getCharacter(this.jwtService.getCharacterIdFromToken()).subscribe({
      next: character => {
        this.characterSubject.next(character); // Set initial character
        this.loadInventory();
        this.loadEquipment();

      },
      error: err => console.log('Error loading character:', err)
    });
  }

  /** Load inventory separately */
  public loadInventory() {
    this.inventoryApiService.getInventory(this.jwtService.getCharacterIdFromToken()).subscribe({
      next: inventory => {

        this.updateCharacter({ inventory }); // Merge inventory into character

      },
      error: err => console.log('Error loading inventory:', err)
    });
  }

  /** Load equipment separately */
  private loadEquipment() {
    this.equipmentApiService.getCharacterEquipment(this.jwtService.getCharacterIdFromToken()).subscribe({
      next: equipment => {
        this.updateCharacter({ equipment }); // Merge equipment into character

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
  public getCharacter(): CharacterModel | null {
    return this.characterSubject.value;
  }

  public getCharacterGoldAmount(): number {
    return this.characterSubject.value?.goldAmount ?? 0;
  }

  public getCharacterLevel(): number {
    return this.characterSubject.value?.level ?? 0;
  }


  public setDraggedItem(item: ItemInstanceModel, index: number, draggingFrom: string, inventorySlotId: number) {
    this.draggedItem = { item, index, draggingFrom, inventorySlotId };
  }

  public getDraggedItem() {
    return this.draggedItem
  }
}
