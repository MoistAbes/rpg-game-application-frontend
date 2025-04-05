import {EnemyTemplateModel} from './enemy-template-model';
import {EnemyRankEnum} from '../../enums/enemy-rank-enum';

export class EnemyInstanceModel {
  id:number = 0;
  currentHealth: number = 0;
  maxHealth: number = 0;
  currentArmor: number = 0;
  currentAttack: number = 0;
  level: number = 0;
  rank: EnemyRankEnum | undefined;
  template: EnemyTemplateModel | undefined;
}
