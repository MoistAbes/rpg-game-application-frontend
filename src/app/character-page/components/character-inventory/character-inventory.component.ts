import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {InventorySlotModel} from '../../../models/inventory-slot-model';
import {CharacterInventoryModel} from '../../../models/character-inventory-model';
import {ItemInstanceModel} from '../../../models/items/instance/Item-instance-model';
import {ItemTypeService} from '../../../services/item-type.service';
import {CharacterManagerService} from '../../../global/services/character-manager.service';
import {getFormattedItemType, isWeapon, ItemType} from '../../../enums/ItemType';
import {getFormattedItemRarity, ItemRarity} from '../../../enums/ItemRarity';
import {ItemStatType} from '../../../enums/ItemStatType';
import {getFormattedArmorType} from '../../../enums/ArmorType';
import {getFormattedWeaponType} from '../../../enums/WeaponType';

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
  protected readonly getFormattedArmorType = getFormattedArmorType;
  protected readonly getFormattedItemRarity = getFormattedItemRarity;

  protected readonly isWeapon = isWeapon;

  inventory: CharacterInventoryModel | undefined;
  readonly itemType: typeof ItemType = ItemType;
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

  constructor(private characterManagerService: CharacterManagerService,
              protected itemTypeService: ItemTypeService,
              private characterManager: CharacterManagerService,
              private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.characterManager.character$.subscribe(character => {
      this.inventory = character?.inventory;
    });
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


  getHoverClassBasedOnItemRarity(itemRarity: ItemRarity | undefined): string {

    if (itemRarity == undefined) return 'hover-preview'

    switch (itemRarity) {
      case ItemRarity.COMMON: {
        return 'hover-preview'
      }
      case ItemRarity.RARE: {
        return 'hover-preview-rare'
      }
      case ItemRarity.EPIC: {
        return 'hover-preview-epic'
      }
      case ItemRarity.LEGENDARY: {
        return 'hover-preview-legendary'
      }
      default: {
        return 'hover-preview'
      }
    }

  }

  formatItemStatType(itemStatType: ItemStatType | undefined): string {

    if (itemStatType == undefined) return ''

    switch (itemStatType) {
      case ItemStatType.BONUS_ARMOR: {
        return 'Bonus to armor:'
      }
      case ItemStatType.BONUS_HEALTH: {
        return 'Bonus to health:'
      }
      case ItemStatType.ATTACK_SPEED: {
        return 'Bonus to attack speed:'
      }
      case ItemStatType.BONUS_DAMAGE: {
        return 'Bonus to damage:'
      }
      case ItemStatType.CRIT_CHANCE: {
        return 'Bonus to critical chance:'
      }
      case ItemStatType.LIFESTEAL: {
        return 'Additional lifesteal:'
      }
      default: {
        return ''
      }
    }

  }


  protected readonly getFormattedWeaponType = getFormattedWeaponType;
  protected readonly getFormattedItemType = getFormattedItemType;
}
