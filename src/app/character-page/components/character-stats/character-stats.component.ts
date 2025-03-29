import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CharacterModel} from '../../../models/character-model';
import {NgClass, NgForOf, NgIf, NgOptimizedImage, NgStyle} from '@angular/common';
import {MatDivider} from '@angular/material/divider';
import {MatCardContent, MatCardHeader, MatCardModule} from '@angular/material/card';
import {ItemTypeService} from '../../../services/item-type.service';
import {ItemInstanceModel} from '../../../models/items/instance/Item-instance-model';
import {CharacterManagerService} from '../../../global/services/character-manager.service';
import {getFormattedItemType, isWeapon, ItemType} from '../../../enums/ItemType';
import {getFormattedItemRarity, ItemRarity} from '../../../enums/ItemRarity';
import {ItemStatType} from '../../../enums/ItemStatType';
import {InventorySlotModel} from '../../../models/inventory-slot-model';
import {getFormattedArmorType} from '../../../enums/ArmorType';
import {getFormattedWeaponType} from '../../../enums/WeaponType';
import {CharacterEquipmentModel} from '../../../models/character-equipment-model';

@Component({
  selector: 'app-character-stats',
  imports: [
    NgIf,
    MatDivider,
    MatCardHeader,
    MatCardContent,
    MatCardModule,
    NgOptimizedImage,
    NgClass,
    NgForOf,
    NgStyle
  ],
  templateUrl: './character-stats.component.html',
  standalone: true,
  styleUrl: './character-stats.component.css'
})
export class CharacterStatsComponent implements OnInit {
  character: CharacterModel | null = null
  protected readonly ItemType = ItemType;

  draggedItem:  ItemInstanceModel | undefined;
  dragPreviewX: number = -9999;
  dragPreviewY: number = -9999;
  isDragging: boolean = false;

  startingType: ItemType | undefined


  hoverItem: ItemInstanceModel | undefined;
  hoverPreviewX: number = 0;
  hoverPreviewY: number = 0;

  isItemImgLoadedList: boolean[] = []

  constructor(protected itemTypeService: ItemTypeService,
              private characterManager: CharacterManagerService,
              private cdRef: ChangeDetectorRef) {
  }



  ngOnInit(): void {
    this.characterManager.character$.subscribe(character => {
      this.character = character;
      console.log("CHARACTER: ", this.character);

      if (this.isItemImgLoadedList.length == 0 && this.character != null && this.character.equipment) {
        this.setIsItemImgLoadedList();
      }
    });


  }

  setIsItemImgLoadedList() {

    const equipmentSlots: Array<keyof CharacterEquipmentModel> = ['helmet', 'chest', 'gloves', 'boots', 'mainHand'];
    console.log('test: ', this.character!.equipment![equipmentSlots[0]]);
    console.log('test: ', this.character!.equipment![equipmentSlots[1]]);
    console.log('test: ', this.character!.equipment![equipmentSlots[2]]);
    console.log('test: ', this.character!.equipment![equipmentSlots[3]]);
    console.log('test: ', this.character!.equipment![equipmentSlots[4]]);


    this.isItemImgLoadedList = equipmentSlots.map(slot =>
      !this.character?.equipment?.[slot]
    );


    console.log("isItemImgLoadedList: ", this.isItemImgLoadedList);

  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); // Allows dropping
  }

  onDrop(event: DragEvent, slotType: ItemType, equipmentItemInstance: ItemInstanceModel | undefined) {
    event.preventDefault();

    if (this.characterManager.getDraggedItem()?.draggingFrom == 'inventory') {
      this.characterManager.equipDraggedItemToEquipmentSlot(slotType, equipmentItemInstance);
    }


    this.draggedItem = undefined;
    this.isDragging = false;



  }

  onDragStart(event: DragEvent, index: number, itemInstance: ItemInstanceModel): void {

    this.startingType = itemInstance.type;

    this.draggedItem = itemInstance
    this.characterManager.setDraggedItem(itemInstance, index, "equipment", 0);

    // Trigger change detection to ensure the *ngIf renders the drag preview
    this.cdRef.detectChanges();


    // Get the element for drag preview (you can use the same div or image directly here)
    const dragPreview = document.querySelector('#drag-preview-id') as HTMLElement;

    if (dragPreview) {
      // Use the drag-preview element as the drag image
      event.dataTransfer?.setDragImage(dragPreview, 32, 32); // You can set offsets for positioning
    }

  }

  onMouseDownHover() {
    this.hoverItem = undefined;
    this.isDragging = true
  }

  onHoverEnd() {
    this.hoverItem = undefined;
  }

  onHoverMouseMove(event: MouseEvent ,itemInstance: ItemInstanceModel | undefined) {

    if  (itemInstance != undefined){
      if (!this.isDragging){
        if (this.hoverItem?.id != itemInstance.id) {
          this.hoverItem = itemInstance;
        }
        this.hoverPreviewX = event.clientX + 25;  // X position of the mouse
        this.hoverPreviewY = event.clientY - 25;  // Y position of the mouse
      }
    }
  }

  onHoverMouseEnter(event: MouseEvent, itemInstance: ItemInstanceModel | undefined) {

    if (itemInstance != undefined){
      this.isDragging = false;
      this.hoverItem = itemInstance;

      this.hoverPreviewX = event.clientX + 25;  // X position of the mouse
      this.hoverPreviewY = event.clientY - 25;  // Y position of the mouse
    }
  }

  onMouseUpHover(event: MouseEvent ,itemInstance: ItemInstanceModel | undefined) {

    if (itemInstance != undefined) {
      this.hoverPreviewX = event.clientX + 25;  // X position of the mouse
      this.hoverPreviewY = event.clientY - 25;  // Y position of the mouse

      this.isDragging = false;
      this.hoverItem = itemInstance;
    }
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

  getHealthPercentage(): number {
    return (this.character!.characterStats!.currentHealth / this.character!.characterStats!.maxHealth) * 100;
  }

  getExperiencePercentage(): number {
    return (this.character!.experience / this.character!.nextLevelExperience) * 100;
  }

  protected readonly getFormattedItemRarity = getFormattedItemRarity;
  protected readonly getFormattedArmorType = getFormattedArmorType;
  protected readonly isWeapon = isWeapon;
  protected readonly getFormattedWeaponType = getFormattedWeaponType;
  protected readonly getFormattedItemType = getFormattedItemType;

  onEquipmentItemImgLoad(equipmentIndex: number) {
    console.log('equipment item image loaded: ', equipmentIndex);

    this.isItemImgLoadedList[equipmentIndex] = true;
  }
}
