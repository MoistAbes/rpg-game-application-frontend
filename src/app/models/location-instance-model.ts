import {LocationModel} from './location-model';

export class LocationInstanceModel{
  id: number = 0;
  characterId: number = 0;
  location: LocationModel | undefined;
  enemyInstanceId: number[] = []
}
