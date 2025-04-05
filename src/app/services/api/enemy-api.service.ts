import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {API_ENDPOINTS} from '../../endpoints/api-endpoints';
import {Observable} from 'rxjs';
import {EnemyInstanceModel} from '../../models/enemy/enemy-instance-model';
import {EnemyTypeEnum} from '../../enums/enemy-type-enum';
import {GenerateEnemyRequest} from '../../dto/request/generate-enemy-request';

@Injectable({
  providedIn: 'root'
})
export class EnemyApiService {

  private readonly apiUrl = API_ENDPOINTS.BASE_URL; // Use the base URL from the config

  constructor(private http: HttpClient) { }

  // public generateEnemy(enemyTemplateId: number): Observable<EnemyInstanceModel> {
  //   return this.http.post<EnemyInstanceModel>(this.apiUrl + API_ENDPOINTS.ENEMY_SERVICE.GENERATE_ENEMY + enemyTemplateId, {})
  // }

  public generateEnemy(generateEnemyRequest: GenerateEnemyRequest): Observable<EnemyInstanceModel> {
    return this.http.post<EnemyInstanceModel>(this.apiUrl + API_ENDPOINTS.ENEMY_SERVICE.GENERATE_ENEMY, generateEnemyRequest)
  }

  public getEnemyTemplateIdsByTypeAndTier(enemyTypes: EnemyTypeEnum[], tiers: number[]): Observable<number[]>  {
    let params = new HttpParams();
    params = this.createHttpParams(params, 'enemyTypes', enemyTypes);
    params = this.createHttpParams(params, 'tiers', tiers);
    return this.http.get<number[]>(this.apiUrl + API_ENDPOINTS.ENEMY_SERVICE.GET_ENEMY_TEMPLATE_BY_TYPE_AND_RANK, {params})
  }

  private createHttpParams(params: HttpParams, paramName: string, values: any[]): HttpParams {
    values.forEach(value => {
      params = params.append(paramName, value.toString());
    });
    return params;
  }

}
