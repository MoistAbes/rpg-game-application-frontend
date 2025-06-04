import {LocationModel} from './location-model';
import {EnemyTypeEnum} from '../enums/enemy-type-enum';
import {ZoneStatusEventModel} from './zone-status-event-model';

export class ZoneModel {

  id: number = 0;

  name: string = '';
  description: string = '';
  positionX: number = 0;
  positionY: number = 0;

  iconPath: string = '';
  locations: LocationModel[] = [];
  allowedEnemyTypes: EnemyTypeEnum[] = [];
  statuses: ZoneStatusEventModel[] = []

}
