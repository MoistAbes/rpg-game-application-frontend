import {EnemyTemplateModel} from './enemy-template-model';
import {EnemyRank} from '../../enums/enemy-rank';

export class EnemyInstanceModel {
  id:number = 0;
  currentHealth: number = 0;
  maxHealth: number = 0;
  currentArmor: number = 0;
  currentAttack: number = 0;
  level: number = 0;
  rank: EnemyRank | undefined;
  template: EnemyTemplateModel | undefined;
}
