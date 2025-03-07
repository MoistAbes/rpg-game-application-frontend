import { Injectable } from '@angular/core';
import {API_ENDPOINTS} from '../../endpoints/api-endpoints';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CharacterEquipmentModel} from '../../models/character-equipment-model';
import {ItemType} from '../../enums/ItemType';

@Injectable({
  providedIn: 'root'
})
export class EquipmentApiService {

  private apiUrl = API_ENDPOINTS.BASE_URL; // Use the base URL from the config


  constructor(private http: HttpClient) { }


  public getCharacterEquipment(characterId: string | null): Observable<CharacterEquipmentModel> {
    return this.http.get<CharacterEquipmentModel>(`${this.apiUrl}${API_ENDPOINTS.INVENTORY_SERVICE.GET_EQUIPMENTS}` + characterId);
  }


  public unequipItemToEmptySlot(inventorySlotId: number, equipmentId: number, itemType: string): Observable<any> {

    const params = new HttpParams().set('itemType', itemType.toString());
    const headers = new HttpHeaders().set('X-Skip-Loading', 'true');

    return this.http.put<any>(`${this.apiUrl}${API_ENDPOINTS.INVENTORY_SERVICE.UNEQUIP_ITEM_TO_EMPTY_SLOT}${inventorySlotId}/${equipmentId}`, {}, { params, headers });
  }

  public unequipItemToTakenSlot(inventorySlotId: number, equipmentId: number, itemType: string): Observable<any> {

    const params = new HttpParams().set('itemType', itemType.toString());
    const headers = new HttpHeaders().set('X-Skip-Loading', 'true');


    return this.http.put<any>(`${this.apiUrl}${API_ENDPOINTS.INVENTORY_SERVICE.UNEQUIP_ITEM_TO_TAKEN_SLOT}${inventorySlotId}/${equipmentId}`, {}, { params, headers });
  }

  public equipItemToEmptySlot(inventorySlotId: number, equipmentId: number, itemType: string): Observable<any> {

    const params = new HttpParams().set('itemType', itemType.toString());
    const headers = new HttpHeaders().set('X-Skip-Loading', 'true');


    return this.http.put<any>(`${this.apiUrl}${API_ENDPOINTS.INVENTORY_SERVICE.EQUIP_ITEM_TO_EMPTY_SLOT}${inventorySlotId}/${equipmentId}`, {}, { params, headers });
  }

  public equipItemToTakenSlot(inventorySlotId: number, equipmentId: number, itemType: string): Observable<any> {

    const params = new HttpParams().set('itemType', itemType.toString());
    const headers = new HttpHeaders().set('X-Skip-Loading', 'true');


    return this.http.put<any>(`${this.apiUrl}${API_ENDPOINTS.INVENTORY_SERVICE.EQUIP_ITEM_TO_TAKEN_SLOT}${inventorySlotId}/${equipmentId}`, {}, { params, headers });
  }

}
