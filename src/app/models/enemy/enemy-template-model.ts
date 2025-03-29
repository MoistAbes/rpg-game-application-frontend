import {EnemyTypeModel} from './enemy-type-model';

export class EnemyTemplateModel {
  id: number = 0;
  name: string = '';
  health: number = 0;
  armor: number = 0;
  attack: number = 0;
  iconPath: string = '';
  enemyTier: number = 0;
  enemyTypes: EnemyTypeModel[] = [];

}
