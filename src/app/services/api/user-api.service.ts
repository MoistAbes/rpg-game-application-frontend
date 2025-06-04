import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RegisterUserRequest} from '../../dto/request/register-user-request';
import {Observable} from 'rxjs';
import {API_ENDPOINTS} from '../../endpoints/api-endpoints';
import {UserInfoModel} from '../../models/user/user-info-model';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  private apiUrl = API_ENDPOINTS.BASE_URL; // Use the base URL from the config


  constructor(private http: HttpClient) { }


  public registerUser(registerUserRequest: RegisterUserRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl + API_ENDPOINTS.USER_SERVICE.REGISTER, registerUserRequest);
  }

  public getAllUsers(): Observable<UserInfoModel[]> {
    return this.http.get<UserInfoModel[]>(this.apiUrl + API_ENDPOINTS.USER_SERVICE.GET_ALL_USERS);
  }

}
