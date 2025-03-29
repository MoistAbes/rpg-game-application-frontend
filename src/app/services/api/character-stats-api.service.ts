import { Injectable } from '@angular/core';
import {API_ENDPOINTS} from '../../endpoints/api-endpoints';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CharacterStats} from '../../models/character-stats-model';

@Injectable({
  providedIn: 'root'
})
export class CharacterStatsApiService {

  private apiUrl = API_ENDPOINTS.BASE_URL; // Use the base URL from the config


  constructor(private http: HttpClient) {}

  public getCharacterStats(characterId : number): Observable<CharacterStats> {
    const url: string = `${this.apiUrl}${API_ENDPOINTS.CHARACTER_SERVICE.GET_CHARACTER_STATS}` + characterId;

    const headers = new HttpHeaders().set('X-Skip-Loading', 'true');


    return this.http.get<CharacterStats>(url, {headers})
  }

  public updateCharacterCurrentHealth(characterStatsId: number, currentHealth: number): Observable<any> {
    return this.http.put<any>(this.apiUrl + API_ENDPOINTS.CHARACTER_SERVICE.UPDATE_CHARACTER_CURRENT_HEALTH + characterStatsId + "/" + currentHealth, {});
  }
}
