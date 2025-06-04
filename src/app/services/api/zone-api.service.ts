import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_ENDPOINTS} from '../../endpoints/api-endpoints';
import {Observable} from 'rxjs';
import {ZoneModel} from '../../models/zone-model';
import {TimeCycleModel} from '../../models/time-cycle-model';

@Injectable({
  providedIn: 'root'
})
export class ZoneApiService {

  private apiUrl = API_ENDPOINTS.BASE_URL; // Use the base URL from the config

  constructor(private httpClient: HttpClient) { }

  public getZones(): Observable<ZoneModel[]> {
    return this.httpClient.get<ZoneModel[]>(this.apiUrl + API_ENDPOINTS.ZONE_SERVICE.GET_ZONES)
  }


  //ToDO to moze kiedyc przerzucic do osobnego service na time cycle ale nie wiem póki co daje tutaj

  public getTimeCycle(): Observable<TimeCycleModel> {
    return this.httpClient.get<TimeCycleModel>(this.apiUrl + API_ENDPOINTS.ZONE_SERVICE.GET_TIME_CYCLE)
  }


}
