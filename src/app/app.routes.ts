import { Routes } from '@angular/router';
import {LoginPageComponent} from './login-page/components/login-page/login-page.component';
import {CharacterSelectionPageComponent} from './character-selection-page/components/character-selection-page/character-selection-page.component';
import {CharacterPageComponent} from './character-page/components/character-page/character-page.component';
import {HomePageComponent} from './home-page/home-page/home-page.component';
import {characterGuard} from './global/guard/character.guard';
import {BountyPageComponent} from './bounty-page/components/bounty-page/bounty-page.component';
import {MapPageComponent} from './map-page/components/map-page/map-page.component';
import {authGuard} from './global/guard/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },  // Route for the login page
  { path: 'character-selection', component: CharacterSelectionPageComponent, canActivate: [authGuard] },  // Route for the login page
  { path: 'character', component: CharacterPageComponent, canActivate: [authGuard ,characterGuard] }, // Guard applied
  { path: 'bounties', component: BountyPageComponent, canActivate: [authGuard ,characterGuard] }, // Guard applied
  { path: 'map', component: MapPageComponent, canActivate: [authGuard ,characterGuard] }, // Guard applied
  { path: '', component: HomePageComponent },  // Route for the home page
];
