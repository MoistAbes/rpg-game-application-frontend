import { Injectable } from '@angular/core';
import {LocationInstanceModel} from '../../models/location-instance-model';

@Injectable({
  providedIn: 'root'
})
export class LocationInstanceLocalService {
  locationInstance: LocationInstanceModel | null = null;
}
