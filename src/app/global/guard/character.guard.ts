import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {JwtService} from '../services/jwt.service';

export const characterGuard: CanActivateFn = (route, state) => {
  const jwtService = inject(JwtService);
  const router = inject(Router);

  if (jwtService.isCharacterIdPresent()) {
    return true; // Allow navigation
  } else {
    router.navigate(['/character-selection']); // Redirect if no character selected
    return false; // Block navigation
  }
};
