import {CombatLogModel} from './combat-log-model';

export class CombatResultModel {
  success: boolean = false;
  combatLogs: CombatLogModel[] = []
  experience: number = 0;
  droppedItems: number[] = []
}
