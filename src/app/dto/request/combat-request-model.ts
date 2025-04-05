import {EnemyInstanceModel} from '../../models/enemy/enemy-instance-model';
import {CharacterModel} from '../../models/character/character-model';


export class CombatRequestModel {
  playerCharacter: CharacterModel | null = null;
  enemyInstance: EnemyInstanceModel | undefined;
}
