import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {API_ENDPOINTS} from '../../endpoints/api-endpoints';
import {Observable} from 'rxjs';
import {CharacterInventoryModel} from '../../models/character-inventory-model';

@Injectable({
  providedIn: 'root'
})
export class InventoryApiService {

  private apiUrl = API_ENDPOINTS.BASE_URL; // Use the base URL from the config


  constructor(private http: HttpClient) { }


  public getInventory(characterId: string | null): Observable<CharacterInventoryModel> {
    return this.http.get<CharacterInventoryModel>(`${this.apiUrl}${API_ENDPOINTS.INVENTORY_SERVICE.GET_INVENTORY}` + characterId);
  }


  moveItem(prevPosition: number, newPosition: number, inventoryId: number) {

    const headers = new HttpHeaders().set('X-Skip-Loading', 'true');


    return this.http.put<void>(`${this.apiUrl}${API_ENDPOINTS.INVENTORY_SERVICE.MOVE_ITEM}` + prevPosition + "/" + newPosition + "/" + inventoryId, {}, {headers});
  }
}
