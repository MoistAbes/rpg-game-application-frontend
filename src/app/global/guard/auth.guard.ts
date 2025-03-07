import {CanActivateFn, Router} from '@angular/router';
import {JwtService} from '../services/jwt.service';
import {inject} from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const jwtService = inject(JwtService);
  const router = inject(Router);

  if (jwtService.hasToken()) {
    return true; // Allow access
  } else {
    router.navigate(['/login']); // Redirect if no token
    return false;
  }
};
