import {ZoneModel} from './zone-model';

export class LocationModel {

  id: number = 0;
  name: string = "";
  allowedTiers: number[] = [];
  specialEnemyIds: number[] = [];
  minEnemyLevel: number = 0;
  maxEnemyLevel: number = 0;
  zone: ZoneModel | undefined;

}
