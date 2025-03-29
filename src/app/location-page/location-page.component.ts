import {Component, OnInit} from '@angular/core';
import {EnemyApiService} from '../services/api/enemy-api.service';
import {EnemyInstanceModel} from '../models/enemy/enemy-instance-model';
import {NgClass, NgIf, NgOptimizedImage, NgStyle} from '@angular/common';
import {CharacterModel} from '../models/character-model';
import {CharacterManagerService} from '../global/services/character-manager.service';
import {ItemTypeService} from '../services/item-type.service';
import {CombatApiService} from '../services/api/combat-api.service';
import {CombatRequestModel} from '../models/combat-request-model';
import {CombatLogModel} from '../models/combat-log-model';
import {SoundService} from '../global/services/sound.service';
import {CombatResultModel} from '../models/combat-result-model';
import {ZoneModel} from '../models/zone-model';
import {LocationModel} from '../models/location-model';
import {EnemyType} from '../enums/enemy-type';
import {EnemyRank} from '../enums/enemy-rank';
import {ZoneDbService} from '../global/services/zone-db.service';
import {GenerateEnemyRequest} from '../dto/request/generate-enemy-request';

@Component({
  selector: 'app-location-page',
  imports: [
    NgOptimizedImage,
    NgIf,
    NgStyle,
    NgClass
  ],
  templateUrl: './location-page.component.html',
  standalone: true,
  styleUrl: './location-page.component.css'
})
export class LocationPageComponent implements OnInit {

  zone: ZoneModel | undefined;
  location: LocationModel | undefined;

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
              private zoneDbService: ZoneDbService,) {}


  async ngOnInit() {

    // Load the zone and location from IndexedDB
    this.zone = await this.zoneDbService.getZone();
    this.location = await this.zoneDbService.getLocation();

    this.loadEnemyTemplateIds();

    this.characterManagerService.character$.subscribe(
      (character) => {
        this.character = character;  // Now you have access to the character
      }
    );
    this.characterManagerService.loadCharacter();
  }

  loadEnemyTemplateIds() {

    const enemyTypes: EnemyType[] = this.zone?.allowedEnemyTypes
      .filter((e): e is EnemyType => e !== undefined) || [];

    const allowedTiers: number[] = this.location?.allowedTiers.filter((e) => e !== undefined) || [];

    this.enemyApiService.getEnemyTemplateIdsByTypeAndTier(enemyTypes, allowedTiers).subscribe({
      next: value => {this.enemyTemplateIds = value;},
      error: err => {console.log("error while loading enemy template ids: ", err)},
      complete: () => {}
    })
  }


  generateEnemy() {
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
    request.minEnemyLevel = this.location?.minEnemyLevel
    request.maxEnemyLevel = this.location?.maxEnemyLevel

    console.log("generate enemy request: ", request)

    return request;
  }

  randomizeEnemySelection(): number {
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

  attackClicked() {
    this.isPlayerAttacking = true;

    // Reset animation after it completes (2s duration)
    setTimeout(() => {
      this.isPlayerAttacking = false;
    }, 1000);
  }


  startCombat() {
    this.isPlayerInCombat = true;

    console.log("generating dto");
    const combatRequest = this.setUpCombatRequest();
    const startTime = performance.now(); // ✅ Capture start time
    console.log("starting combat")

    this.combatApiService.startCombat(combatRequest).subscribe({
      next: combatResult => {
        this.combatResult = combatResult;
        console.log("combat started: ",  this.combatResult);
      },
      error: err => {
        console.log(err);
        this.isPlayerInCombat = false;
      },
      complete: () => {
        const endTime = performance.now(); // ✅ Capture end time
        const elapsedTime = endTime - startTime; // ✅ Calculate duration in milliseconds
        console.log(`Combat request completed in ${elapsedTime.toFixed(2)} ms`);

        this.animateCombat();
      }
    });
  }


  setUpCombatRequest(): CombatRequestModel {
    let combatRequest: CombatRequestModel = {
      playerCharacter: this.character,
      enemyInstance: this.enemy
    };

    //clean up of not used info in template
    //ToDO tutaj moze trzeba by bylo jakies specjalne dto robic a nie tak czyscic obiekt i na sile go dopasowywac

    // combatRequest.enemyInstance!.template = new EnemyTemplateModel()
    combatRequest.enemyInstance!.template!.enemyTier = this.enemy!.template!.enemyTier
    console.log("combatRequest", combatRequest);


    console.log("Combat request: ", combatRequest);

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

  getRankClass(rank: EnemyRank | undefined): string {
    // rank = rank as EnemyRank
    // console.log("rank: ", rank);
    switch (rank) {
      case EnemyRank.NORMAL:
        return 'normal';
      case EnemyRank.ELITE:
        return 'elite';
      case EnemyRank.CHAMPION:
        return 'champion';
      case EnemyRank.BOSS:
        return 'boss';
      case EnemyRank.MYTHIC:
        return 'mythic';
      default:
        return '';
    }
  }

  onEnemyImageLoaded() {
    console.log("enemy image loaded");
    this.isEnemyImageLoaded = true;
  }

  addActionToCombatLog(log: string) {
    this.combatLog += log + "\n";
  }
}
