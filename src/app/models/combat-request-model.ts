import {CharacterModel} from './character-model';
import {EnemyInstanceModel} from './enemy/enemy-instance-model';

export class CombatRequestModel {
  playerCharacter: CharacterModel | null = null;
  enemyInstance: EnemyInstanceModel | undefined;
}
