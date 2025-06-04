import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgOptimizedImage, NgStyle} from '@angular/common';
import {MatDivider} from '@angular/material/divider';
import {MatCardContent, MatCardHeader, MatCardModule} from '@angular/material/card';
import {getFormattedItemType, isWeapon, ItemTypeEnum} from '../../../../enums/item-type-enum';
import {ItemInstanceModel} from '../../../../models/items/instance/Item-instance-model';
import {ItemTypeService} from '../../../../services/item-type.service';
import {CharacterManagerService} from '../../../../global/services/character-manager.service';
import {EquipmentItemTypeService} from '../../../../services/equipment-item-type.service';
import {getFormattedItemRarity, ItemRarityEnum} from '../../../../enums/item-rarity-enum';
import {ItemStatTypeEnum} from '../../../../enums/item-stat-type-enum';
import {getFormattedWeaponType} from '../../../../enums/weapon-type-enum';
import {getFormattedArmorType} from '../../../../enums/armor-type-enum';
import {CharacterModel} from '../../../../models/character/character-model';
import {CharacterEquipmentModel} from '../../../../models/character/character-equipment-model';


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
  protected readonly getFormattedWeaponType = getFormattedWeaponType;
  protected readonly getFormattedItemRarity = getFormattedItemRarity;
  protected readonly getFormattedItemType = getFormattedItemType;
  protected readonly isWeapon = isWeapon;
  protected readonly getFormattedArmorType = getFormattedArmorType;

  character: CharacterModel | null = null
  protected readonly ItemType = ItemTypeEnum;

  draggedItem:  ItemInstanceModel | undefined;
  dragPreviewX: number = -9999;
  dragPreviewY: number = -9999;
  isDragging: boolean = false;

  startingType: ItemTypeEnum | undefined


  hoverItem: ItemInstanceModel | undefined;
  hoverPreviewX: number = 0;
  hoverPreviewY: number = 0;

  isItemImgLoadedList: boolean[] = []

  constructor(protected itemTypeService: ItemTypeService,
              private characterManager: CharacterManagerService,
              protected equipmentItemTypeService: EquipmentItemTypeService,
              private cdRef: ChangeDetectorRef) {
  }



  ngOnInit(): void {
    this.characterManager.character$.subscribe(character => {
      this.character = character;

      if (this.isItemImgLoadedList.length == 0 && this.character != null && this.character.equipment) {
        this.setIsItemImgLoadedList();
      }
    });


  }

  setIsItemImgLoadedList() {

    const equipmentSlots: Array<keyof CharacterEquipmentModel> = ['helmet', 'chest', 'gloves', 'boots', 'mainHand'];


    this.isItemImgLoadedList = equipmentSlots.map(slot =>
      !this.character?.equipment?.[slot]
    );

  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); // Allows dropping
  }

  onDrop(event: DragEvent, slotType: ItemTypeEnum, equipmentItemInstance: ItemInstanceModel | undefined) {
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

  getHealthPercentage(): number {
    return (this.character!.characterStats!.currentHealth / this.character!.characterStats!.maxHealth) * 100;
  }

  getExperiencePercentage(): number {
    return (this.character!.experience / this.character!.nextLevelExperience) * 100;
  }



  onEquipmentItemImgLoad(equipmentIndex: number) {

    this.isItemImgLoadedList[equipmentIndex] = true;
  }


}
