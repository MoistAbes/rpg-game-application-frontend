import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {JwtService} from '../services/jwt.service';

export function roleGuard(requiredRoles: string[]): CanActivateFn {
  return (route, state) => {
    const jwtService = inject(JwtService);
    const router = inject(Router);

    const userRoles = jwtService.getUserRolesFromToken();

    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

    if (hasRequiredRole) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  };
}
