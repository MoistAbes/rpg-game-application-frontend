import { Injectable } from '@angular/core';
import {API_ENDPOINTS} from '../../endpoints/api-endpoints';
import {HttpClient} from '@angular/common/http';
import {LoginRequestModel} from '../../models/login-request-model';
import {Observable} from 'rxjs';
import {JwtTokenDto} from '../../dto/JwtTokenDto';
import {CharacterModel} from '../../models/character-model';

@Injectable({
  providedIn: 'root'
})
export class CharacterApiService {

  private apiUrl = API_ENDPOINTS.BASE_URL; // Use the base URL from the config


  constructor(private http: HttpClient) {}


  public getUserCharacters(userId : number): Observable<CharacterModel[]> {
    const url: string = `${this.apiUrl}${API_ENDPOINTS.CHARACTER_SERVICE.GET_ALL_BY_USER}` + userId;
    return this.http.get<CharacterModel[]>(url)
  }

  public getCharacter(characterId: string | null): Observable<CharacterModel> {
    const url: string = `${this.apiUrl}${API_ENDPOINTS.CHARACTER_SERVICE.GET_CHARACTER}` + characterId;
    return this.http.get<CharacterModel>(url);

  }

}
