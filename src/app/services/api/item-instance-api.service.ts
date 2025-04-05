import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_ENDPOINTS} from '../../endpoints/api-endpoints';
import {ItemInstanceModel} from '../../models/items/instance/Item-instance-model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemInstanceApiService {

  private apiUrl = API_ENDPOINTS.BASE_URL; // Use the base URL from the config


  constructor(private http: HttpClient) { }

  public getAllItemInstanceListByIds(itemInstanceIdList: number[]): Observable<ItemInstanceModel[]> {
    return this.http.post<ItemInstanceModel[]>(`${this.apiUrl}${API_ENDPOINTS.INVENTORY_SERVICE.GET_ALL_ITEM_INSTANCE_BY_IDS}`, itemInstanceIdList);
  }

}
