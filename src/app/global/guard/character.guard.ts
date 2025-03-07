import {CanActivateFn, Router} from '@angular/router';
import {CharacterLocalService} from '../services/character-local.service';
import {inject} from '@angular/core';

export const characterGuard: CanActivateFn = (route, state) => {
  const characterService = inject(CharacterLocalService);
  const router = inject(Router);

  if (characterService.hasCharacterData()) {
    return true; // Allow navigation
  } else {
    router.navigate(['/character-selection']); // Redirect if no character selected
    return false; // Block navigation
  }
};
