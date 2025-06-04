import { Routes } from '@angular/router';
import {characterGuard} from './global/guard/character.guard';
import {authGuard} from './global/guard/auth.guard';
import {BountyPageComponent} from './pages/bounty-page/bounty-page.component';
import {LoginPageComponent} from './pages/login-page/components/login-page/login-page.component';
import {RegisterPageComponent} from './pages/register-page/register-page.component';
import {CharacterSelectionPageComponent} from './pages/character-selection-page/components/character-selection-page/character-selection-page.component';
import {CharacterPageComponent} from './pages/character-page/components/character-page/character-page.component';
import {TavernPageComponent} from './pages/tavern-page/tavern-page.component';
import {MapPageComponent} from './pages/map-page/components/map-page/map-page.component';
import {LocationPageComponent} from './pages/location-page/location-page.component';
import {HomePageComponent} from './pages/home-page/home-page/home-page.component';
import {QuestPageComponent} from './pages/quest-page/quest-page.component';
import {AdminPageComponent} from './pages/admin-page/admin-page.component';
import {roleGuard} from './global/guard/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },  // Route for the login page
  { path: 'register', component: RegisterPageComponent },  // Route for the register page
  { path: 'character-selection', component: CharacterSelectionPageComponent, canActivate: [authGuard] },  // Route for the login page
  { path: 'character', component: CharacterPageComponent, canActivate: [authGuard ,characterGuard] }, // Guard applied
  { path: 'tavern', component: TavernPageComponent, canActivate: [authGuard ,characterGuard] }, // Guard applied
  { path: 'bounties', component: BountyPageComponent, canActivate: [authGuard ,characterGuard] }, // Guard applied
  { path: 'map', component: MapPageComponent, canActivate: [authGuard ,characterGuard] }, // Guard applied
  { path: 'quests', component: QuestPageComponent, canActivate: [authGuard ,characterGuard] }, // Guard applied
  { path: 'location/:zoneName/:locationName', component: LocationPageComponent, canActivate: [authGuard ,characterGuard] }, // Guard applied
  { path: 'admin', component: AdminPageComponent, canActivate: [authGuard , roleGuard(["ROLE_ADMIN"])] }, // Guard applied
  { path: '', component: HomePageComponent },  // Route for the home page
];
