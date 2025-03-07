import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {JwtService} from '../../../services/jwt.service';
import {NgIf} from '@angular/common';
import {CharacterApiService} from '../../../../services/api/character-api.service';
import {CharacterLocalService} from '../../../services/character-local.service';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isMenuOpen: boolean = false;

  constructor(private router: Router,
              protected jwtService: JwtService,
              protected characterLocalService: CharacterLocalService,) {
  }

  toggleMenu(event: MouseEvent) {
    // Prevent the dropdown from closing immediately when clicking inside
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
    console.log(this.isMenuOpen);
  }

  // Open menu
  openMenu(event: Event) {
    event.stopPropagation(); // Prevent event from bubbling up
    this.isMenuOpen = true;
  }

  // Close menu
  closeMenu(event: Event) {
    event.stopPropagation(); // Prevent event from bubbling up
    this.isMenuOpen = false;
  }

  logout() {
    this.isMenuOpen = false
    this.jwtService.removeToken();
    this.characterLocalService.removeCharacterData()
  }

  routeToCharacterSelection() {
    this.isMenuOpen = false
    this.characterLocalService.removeCharacterData()
  }
}
