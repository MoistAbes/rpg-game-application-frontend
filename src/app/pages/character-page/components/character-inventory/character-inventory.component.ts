import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {getFormattedItemType, isWeapon, ItemTypeEnum} from '../../../../enums/item-type-enum';
import {ItemInstanceModel} from '../../../../models/items/instance/Item-instance-model';
import {CharacterManagerService} from '../../../../global/services/character-manager.service';
import {ItemTypeService} from '../../../../services/item-type.service';
import {EquipmentItemTypeService} from '../../../../services/equipment-item-type.service';
import {getFormattedItemRarity, ItemRarityEnum} from '../../../../enums/item-rarity-enum';
import {ItemStatTypeEnum} from '../../../../enums/item-stat-type-enum';
import {getFormattedWeaponType} from '../../../../enums/weapon-type-enum';
import {getFormattedArmorType} from '../../../../enums/armor-type-enum';
import {CharacterInventoryModel} from '../../../../models/character/character-inventory-model';
import {InventorySlotModel} from '../../../../models/character/inventory-slot-model';


@Component({
  selector: 'app-character-inventory',
  imports: [
    NgForOf,
    NgIf,
    DragDropModule,
    NgOptimizedImage,
    CommonModule
  ],
  templateUrl: './character-inventory.component.html',
  standalone: true,
  styleUrl: './character-inventory.component.css'
})
export class CharacterInventoryComponent implements OnInit {


  inventory: CharacterInventoryModel | undefined;
  readonly itemType: typeof ItemTypeEnum = ItemTypeEnum;
  //dragging item
  draggedItemInstance: ItemInstanceModel | null = null;
  dragPreviewX: number = -9999;
  dragPreviewY: number = -9999;
  isDragging: boolean = false;

  startingIndex: number | null = null;

  //hovering item
  hoveredSlot: InventorySlotModel | null = null;
  hoverPreviewX: number = 0;
  hoverPreviewY: number = 0;

  //item image loaders
  itemsImagesLoadingStatusList: boolean[] = [];

  constructor(protected characterManagerService: CharacterManagerService,
              protected itemTypeService: ItemTypeService,
              private characterManager: CharacterManagerService,
              private cdRef: ChangeDetectorRef,
              protected equipmentItemTypeService: EquipmentItemTypeService,) {
  }

  ngOnInit(): void {
    this.characterManager.character$.subscribe(character => {
      this.inventory = character?.inventory;

      this.setItemImageLoaderStatuses();
    });
  }

  //method that will set starting image load statuses of inventory items
  setItemImageLoaderStatuses() {
    this.inventory?.inventorySlots.forEach(inventorySlot => {
      if (inventorySlot.itemInstance == null) {
        this.itemsImagesLoadingStatusList.push(false)
      }else {
        this.itemsImagesLoadingStatusList.push(true)
      }
    })
  }

  onDragStart(item: ItemInstanceModel, itemIndex: number, event: DragEvent, inventorySlotId: number): void {

    //check
    this.startingIndex = itemIndex;

    this.characterManagerService.setDraggedItem(item, itemIndex, "inventory", inventorySlotId);

    this.draggedItemInstance = item;


    // Trigger change detection to ensure the *ngIf renders the drag preview
    this.cdRef.detectChanges();

    // Get the element for drag preview (you can use the same div or image directly here)
    const dragPreview = document.querySelector('#drag-preview-inventory-id') as HTMLElement;

    if (dragPreview) {
      // Use the drag-preview element as the drag image
      event.dataTransfer?.setDragImage(dragPreview, 32, 32); // You can set offsets for positioning
    }
  }

  onDragOver(event: DragEvent) {
    // Prevent the default to allow drop
    event.preventDefault();
  }

  onDragDrop(slotIndex: number): void {

    if (this.startingIndex !== slotIndex || this.characterManager.getDraggedItem()?.draggingFrom === 'equipment') {
      console.log("Moved item to a different slot");
      this.characterManager.equipDraggedItemToInventorySlot(slotIndex);
    }

    this.isDragging = false;
    this.startingIndex = null;
    this.draggedItemInstance = null;
  }

  onHoverMouseMove(event: MouseEvent ,slot: InventorySlotModel) {

    if (slot.itemInstance != null){
      if (!this.isDragging){

        this.hoverPreviewX = event.clientX + 25;  // X position of the mouse
        this.hoverPreviewY = event.clientY - 25;  // Y position of the mouse
      }
    }

  }

  onHoverMouseEnter(event: MouseEvent, slot: InventorySlotModel) {
    this.isDragging = false;
    this.hoveredSlot = slot;

    this.hoverPreviewX = event.clientX + 25;  // X position of the mouse
    this.hoverPreviewY = event.clientY - 25;  // Y position of the mouse
  }

  onMouseDownHover() {
    this.hoveredSlot = null;
    this.isDragging = true
  }

  onMouseUpHover(event: MouseEvent ,slot: InventorySlotModel) {

    this.hoverPreviewX = event.clientX + 25;  // X position of the mouse
    this.hoverPreviewY = event.clientY - 25;  // Y position of the mouse

    this.isDragging = false;
    this.hoveredSlot = slot;
  }

  onHoverEnd() {
    this.hoveredSlot = null;
  }


  getHoverClassBasedOnItemRarity(itemRarity: ItemRarityEnum | undefined): string {

    if (itemRarity == undefined) return 'hover-preview'

    switch (itemRarity) {
      case ItemRarityEnum.COMMON: {
        return 'hover-preview'
      }
      case ItemRarityEnum.RARE: {
        return 'hover-preview-rare'
      }
      case ItemRarityEnum.EPIC: {
        return 'hover-preview-epic'
      }
      case ItemRarityEnum.LEGENDARY: {
        return 'hover-preview-legendary'
      }
      default: {
        return 'hover-preview'
      }
    }

  }

  formatItemStatType(itemStatType: ItemStatTypeEnum | undefined, itemStatValue: number): string {

    if (itemStatType == undefined) return ''

    switch (itemStatType) {
      case ItemStatTypeEnum.BONUS_ARMOR: {
        return 'Bonus to armor: ' + itemStatValue
      }
      case ItemStatTypeEnum.BONUS_HEALTH: {
        return 'Bonus to health: ' + itemStatValue
      }
      case ItemStatTypeEnum.ATTACK_SPEED: {
        return 'Bonus to attack speed: ' + itemStatValue
      }
      case ItemStatTypeEnum.BONUS_DAMAGE: {
        return 'Bonus to damage: ' + itemStatValue
      }
      case ItemStatTypeEnum.CRITICAL_CHANCE: {
        return 'Bonus to critical chance: ' + itemStatValue + "%"
      }
      case ItemStatTypeEnum.CRITICAL_DAMAGE: {
        return 'Bonus to critical damage: ' + itemStatValue + "%"
      }
      case ItemStatTypeEnum.LIFESTEAL: {
        return 'Additional lifesteal: ' + itemStatValue
      }
      default: {
        return ''
      }
    }

  }

  onInventoryItemImgLoad(inventoryImageIndex: number) {
    this.itemsImagesLoadingStatusList[inventoryImageIndex] = false;
  }

  onRightClick(event: MouseEvent, slot: InventorySlotModel) {
    event.preventDefault(); // Prevents the default browser context menu
    console.log("Right-clicked on slot:", slot);
    // Add your custom logic here (e.g., showing an item context menu)

   this.characterManagerService.deleteItemFromInventory(slot);

  }


  protected readonly getFormattedWeaponType = getFormattedWeaponType;
  protected readonly getFormattedArmorType = getFormattedArmorType;
  protected readonly getFormattedItemType = getFormattedItemType;
  protected readonly getFormattedItemRarity = getFormattedItemRarity;
  protected readonly isWeapon = isWeapon;
}
