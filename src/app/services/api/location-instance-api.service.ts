import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_ENDPOINTS} from '../../endpoints/api-endpoints';
import {LocationInstanceModel} from '../../models/location-instance-model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationInstanceApiService {

  private readonly apiUrl = API_ENDPOINTS.BASE_URL;

  constructor(private httpClient: HttpClient) { }


  public createLocationInstance(locationId: number, characterId: number): Observable<LocationInstanceModel> {
    return this.httpClient.post<LocationInstanceModel>(this.apiUrl + API_ENDPOINTS.ZONE_SERVICE.CREATE_LOCATION_INSTANCE + locationId + "/" + characterId, {})
  }

  public getLocationInstanceByCharacterId(characterId: number): Observable<LocationInstanceModel> {
    return this.httpClient.get<LocationInstanceModel>(this.apiUrl + API_ENDPOINTS.ZONE_SERVICE.GET_LOCATION_INSTANCE_BY_CHARACTER_ID + characterId)
  }

  public deleteLocationInstance(locationInstanceId: number): Observable<any> {
    return this.httpClient.delete<any>(this.apiUrl + API_ENDPOINTS.ZONE_SERVICE.DELETE_LOCATION_INSTANCE + locationInstanceId);
  }

}
