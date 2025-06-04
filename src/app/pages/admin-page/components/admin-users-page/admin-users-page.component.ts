import {Component, OnInit} from '@angular/core';
import {UserInfoModel} from '../../../../models/user/user-info-model';
import {UserApiService} from '../../../../services/api/user-api.service';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-admin-users-page',
  imports: [
    NgForOf
  ],
  templateUrl: './admin-users-page.component.html',
  styleUrl: './admin-users-page.component.css'
})
export class AdminUsersPageComponent implements OnInit {

  users: UserInfoModel[] = [];

  constructor(private userApiService: UserApiService) {}

  ngOnInit(): void {
    this.loadAllUsers()
  }


  loadAllUsers(): void {
    this.userApiService.getAllUsers().subscribe({
      next: fetchedUsers => {
        this.users = fetchedUsers;
      },
      error: error => {
        console.log(error);
      },
      complete: () => {}
    })
  }


}
