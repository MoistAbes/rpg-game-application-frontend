import {Component, OnInit} from '@angular/core';
import {NgClass, NgIf, NgOptimizedImage, NgStyle} from '@angular/common';

import {CharacterInventoryComponent} from '../character-page/components/character-inventory/character-inventory.component';
import {ZoneModel} from '../../models/zone-model';
import {LocationModel} from '../../models/location-model';
import {EnemyInstanceModel} from '../../models/enemy/enemy-instance-model';
import {EnemyApiService} from '../../services/api/enemy-api.service';
import {CharacterManagerService} from '../../global/services/character-manager.service';
import {ItemTypeService} from '../../services/item-type.service';
import {CombatApiService} from '../../services/api/combat-api.service';
import {SoundService} from '../../global/services/sound.service';
import {ItemInstanceApiService} from '../../services/api/item-instance-api.service';
import {EnemyTypeEnum} from '../../enums/enemy-type-enum';
import {GenerateEnemyRequest} from '../../dto/request/generate-enemy-request';
import {EnemyRankEnum} from '../../enums/enemy-rank-enum';
import {CombatResultModel} from '../../models/combat/combat-result-model';
import {CombatRequestModel} from '../../dto/request/combat-request-model';
import {CombatLogModel} from '../../models/combat/combat-log-model';
import {CharacterModel} from '../../models/character/character-model';
import {LocationInstanceApiService} from '../../services/api/location-instance-api.service';
import {LocationInstanceLocalService} from '../../global/services/location-instance-local.service';
import {Router} from '@angular/router';
import {LocationInstanceModel} from '../../models/location-instance-model';

@Component({
  selector: 'app-location-page',
  imports: [
    NgOptimizedImage,
    NgIf,
    NgStyle,
    NgClass,
    CharacterInventoryComponent
  ],
  templateUrl: './location-page.component.html',
  standalone: true,
  styleUrl: './location-page.component.css'
})
export class LocationPageComponent implements OnInit {

  locationInstance: LocationInstanceModel | null = null;

  enemyTemplateIds: number[] = [];

  character: CharacterModel | null = null;
  isPlayerInCombat: boolean = false;
  isPlayerAttacking: boolean = false;
  isEnemyAttacking: boolean = false;

  combatResult: CombatResultModel | undefined;
  combatLog: string = "";

  enemy: EnemyInstanceModel | undefined;
  isEnemyImageLoaded: boolean = false;


  constructor(
              private enemyApiService: EnemyApiService,
              private characterManagerService: CharacterManagerService,
              protected itemTypeService: ItemTypeService,
              protected combatApiService: CombatApiService,
              private soundService: SoundService,
              private locationInstanceApiService: LocationInstanceApiService,
              private locationInstanceLocalService: LocationInstanceLocalService,
              private itemInstanceApiService: ItemInstanceApiService,
              private router: Router) {}


  async ngOnInit() {

    this.locationInstance = this.locationInstanceLocalService.locationInstance;
    this.loadEnemyTemplateIds();

    this.characterManagerService.character$.subscribe(
      (character) => {
        this.character = character;  // Now you have access to the character
      }
    );
    this.characterManagerService.loadCharacter();
  }

  loadEnemyTemplateIds() {

    console.log("location local: ", this.locationInstanceLocalService.locationInstance);
    console.log("LOCATION location instance: ", this.locationInstance)

    const enemyTypes: EnemyTypeEnum[] = this.locationInstance?.location?.zone?.allowedEnemyTypes.filter((e): e is EnemyTypeEnum => e !== undefined) || [];
    const allowedTiers: number[] = this.locationInstance?.location?.allowedTiers?.filter((e) => e !== undefined) || [];

    console.log("enemy types: ", enemyTypes)
    console.log("allowedTiers: ", allowedTiers)

    this.enemyApiService.getEnemyTemplateIdsByTypeAndTier(enemyTypes, allowedTiers).subscribe({
      next: value => {this.enemyTemplateIds = value;},
      error: err => {console.log("error while loading enemy template ids: ", err)},
      complete: () => {}
    })
  }


  generateEnemy() {
    console.log("generate enemy: ", this.createGenerateEnemyRequest())
    this.enemyApiService.generateEnemy(this.createGenerateEnemyRequest()).subscribe({
      next: generatedEnemy => {
        this.enemy = generatedEnemy
        console.log("generated enemy: ", this.enemy)
      },
      error: err => console.log(err),
      complete: () => {}
    })
  }

  createGenerateEnemyRequest(): GenerateEnemyRequest {
    const request = new GenerateEnemyRequest();
    request.enemyTemplateId = this.randomizeEnemySelection();
    request.minEnemyLevel = this.locationInstance?.location?.minEnemyLevel
    request.maxEnemyLevel = this.locationInstance?.location?.maxEnemyLevel


    return request;
  }

  randomizeEnemySelection(): number {
    console.log("enemy templates id: ", this.enemyTemplateIds)

    // Assuming enemyTemplateIds is an array of numbers
    if (this.enemyTemplateIds && this.enemyTemplateIds.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.enemyTemplateIds.length);
      return this.enemyTemplateIds[randomIndex];
    }
    return 0; // Return 0 if the array is empty or undefined
  }


  getHealthPercentage(currentHealth: number, maxHealth: number): number {
    const health = Math.max(currentHealth, 0); // Ensure health is not below 0
    return (health / maxHealth) * 100;
  }

  getExperiencePercentage(): number {
    return (this.character!.experience / this.character!.nextLevelExperience) * 100;
  }

  // attackClicked() {
  //   this.isPlayerAttacking = true;
  //
  //   // Reset animation after it completes (2s duration)
  //   setTimeout(() => {
  //     this.isPlayerAttacking = false;
  //   }, 1000);
  // }


  startCombat() {
    this.isPlayerInCombat = true;

    const combatRequest = this.setUpCombatRequest();
    const startTime = performance.now(); // ✅ Capture start time

    this.combatApiService.startCombat(combatRequest).subscribe({
      next: combatResult => {
        this.combatResult = combatResult;
      },
      error: err => {
        console.log(err);
        this.isPlayerInCombat = false;
      },
      complete: () => {
        const endTime = performance.now(); // ✅ Capture end time
        const elapsedTime = endTime - startTime; // ✅ Calculate duration in milliseconds

        //load dropped items
        this.loadDroppedItems();

        this.animateCombat();
      }
    });
  }

  loadDroppedItems() {
    if (this.combatResult?.success){
      this.itemInstanceApiService.getAllItemInstanceListByIds(this.combatResult!.droppedItems).subscribe({
        next: items => {
        },
        error: err => {
          console.log("error while fetching dropped items: ", err);
        },
        complete: () => {}
      })
    }
  }


  setUpCombatRequest(): CombatRequestModel {

    let combatRequest: CombatRequestModel = {
      playerCharacter: {
        id: this.character!.id,
        name: this.character!.name,
        level: this.character!.level,
        experience: this.character!.experience,
        nextLevelExperience: this.character!.nextLevelExperience,
        goldAmount: this.character!.goldAmount,
        inventory: this.character!.inventory
          ? {
            ...this.character!.inventory, // Keep other properties that might be required
            inventorySlots: this.character!.inventory.inventorySlots
              .filter(slot => slot.itemInstance === null) // Keep only empty slots
              .map(slot => ({
                ...slot, // Keep required properties
                position: 0, // Set position to default (or another valid value)
                itemInstance: null // Ensure itemInstance is included with null
              }))
          }
          : undefined, // If inventory is undefined, keep it that way
        characterStats: this.character!.characterStats,
        equipment: undefined
      },
      enemyInstance: this.enemy
    };



    // combatRequest.enemyInstance!.template = new EnemyTemplateModel()
    combatRequest.enemyInstance!.template!.enemyTier = this.enemy!.template!.enemyTier


    return combatRequest;
  }


  animateCombat() {
    let isPlayerTurn: boolean = true;
    let delay = 0; // Start with no delay

    this.combatResult?.combatLogs.forEach((log, index) => {
      setTimeout(() => {
        // console.log("log: ", log);

        if (isPlayerTurn) {
          this.playerAttack(log);
          isPlayerTurn = false;
        } else {
          this.enemyAttack(log);
          isPlayerTurn = true;
        }

        // If it's the last attack, play the victory sound after the last delay
        if (index === this.combatResult!.combatLogs.length - 1 && this.combatResult?.success) {
          setTimeout(() => {
            //update character experience
            this.character!.experience += this.combatResult!.experience;

            this.characterManagerService.loadInventory();


            this.soundService.playSound("victory-sound.mp3");
            this.addActionToCombatLog("Gained " + this.combatResult?.experience + " experience")

            this.isPlayerInCombat = false;
          }, 800); // Wait for the last attack to complete before playing sound
        }

      }, delay);

      delay += 800; // Increase delay for the next attack
    });
  }





  private playerAttack(combatLog: CombatLogModel) {
    this.isPlayerAttacking = true;

    setTimeout(() => {
      this.isPlayerAttacking = false;
      this.soundService.playSound("sword-attack-sound.wav")
      this.enemy!.currentHealth = combatLog.enemyCurrentHealth; // Update health after animation

      //combat log
      this.addActionToCombatLog(combatLog.log);

    }, 800);
  }

  private enemyAttack(combatLog: CombatLogModel) {
    this.isEnemyAttacking = true;

    setTimeout(() => {
      this.isEnemyAttacking = false;
      this.soundService.playSound("sword-attack-sound.wav")
      this.character!.characterStats!.currentHealth = combatLog.playerCurrentHealth; // Update health after animation

      //combat log
      this.addActionToCombatLog(combatLog.log);
    }, 800);
  }

  getRankClass(rank: EnemyRankEnum | undefined): string {
    // rank = rank as EnemyRankEnum
    // console.log("rank: ", rank);
    switch (rank) {
      case EnemyRankEnum.NORMAL:
        return 'normal';
      case EnemyRankEnum.ELITE:
        return 'elite';
      case EnemyRankEnum.CHAMPION:
        return 'champion';
      case EnemyRankEnum.BOSS:
        return 'boss';
      case EnemyRankEnum.MYTHIC:
        return 'mythic';
      default:
        return '';
    }
  }

  onEnemyImageLoaded() {
    this.isEnemyImageLoaded = true;
  }

  addActionToCombatLog(log: string) {
    this.combatLog += log + "\n";
  }

  exitLocation() {

    console.log("location instance id: ", this.locationInstanceLocalService.locationInstance!.id)

    this.locationInstanceApiService.deleteLocationInstance(this.locationInstanceLocalService.locationInstance!.id).subscribe({
      next: result => {},
      error: err => {},
      complete: () => {
        this.locationInstanceLocalService.locationInstance = null
        this.router.navigate(["/map"])
      }
    })




  }
}
