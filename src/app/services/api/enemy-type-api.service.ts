import { Injectable } from '@angular/core';
import {API_ENDPOINTS} from '../../endpoints/api-endpoints';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EnemyTypeModel} from '../../models/enemy/enemy-type-model';

@Injectable({
  providedIn: 'root'
})
export class EnemyTypeApiService {

  private apiUrl = API_ENDPOINTS.BASE_URL; // Use the base URL from the config


  constructor(private http: HttpClient) { }

  public getAllEnemyTypes(): Observable<EnemyTypeModel[]> {
    return this.http.get<EnemyTypeModel[]>(this.apiUrl + API_ENDPOINTS.ENEMY_SERVICE.ENEMY_TYPE_GET_ALL)
  }

}
