import {LocationModel} from './location-model';
import {EnemyType} from '../enums/enemy-type';

export class ZoneModel {

  id: number = 0;

  name: string = '';
  description: string = '';
  positionX: number = 0;
  positionY: number = 0;

  iconPath: string = '';

  locations: LocationModel[] = [];

  allowedEnemyTypes: EnemyType[] = [];

}
