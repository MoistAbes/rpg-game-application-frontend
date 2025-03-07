import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_ENDPOINTS} from '../../endpoints/api-endpoints';
import {LoginRequestModel} from '../../models/login-request-model';
import {Observable} from 'rxjs';
import {JwtTokenDto} from '../../dto/JwtTokenDto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = API_ENDPOINTS.BASE_URL; // Use the base URL from the config


  constructor(private http: HttpClient) {}

  public login(loginRequest : LoginRequestModel): Observable<JwtTokenDto> {
    const url: string = `${this.apiUrl}${API_ENDPOINTS.AUTH_SERVICE.LOGIN}`
    return this.http.post<JwtTokenDto>(url , loginRequest)
  }

}
