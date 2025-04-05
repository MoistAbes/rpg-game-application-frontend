import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_ENDPOINTS} from '../../endpoints/api-endpoints';
import {Observable} from 'rxjs';
import {CombatRequestModel} from '../../dto/request/combat-request-model';
import {CombatResultModel} from '../../models/combat/combat-result-model';


@Injectable({
  providedIn: 'root'
})
export class CombatApiService {

  private apiUrl = API_ENDPOINTS.BASE_URL; // Use the base URL from the config


  constructor(private http: HttpClient) { }

  public startCombat(combatRequest: CombatRequestModel): Observable<CombatResultModel> {
    return this.http.put<CombatResultModel>(this.apiUrl + API_ENDPOINTS.COMBAT_SERVICE.START_COMBAT, combatRequest);
  }
}
