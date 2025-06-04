import { Component } from '@angular/core';
import {AdminUsersPageComponent} from './components/admin-users-page/admin-users-page.component';
import {NgIf} from '@angular/common';
import {AdminZonesPageComponent} from './components/admin-zones-page/admin-zones-page.component';

@Component({
  selector: 'app-admin-page',
  imports: [
    AdminUsersPageComponent,
    NgIf,
    AdminZonesPageComponent
  ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent {

  activePanel: 'users' | 'zones' | null = 'users'; // default visible panel

  setPanel(panel: 'users' | 'zones') {
    this.activePanel = panel;
  }

}
