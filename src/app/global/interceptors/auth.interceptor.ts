import { HttpInterceptorFn } from '@angular/common/http';
import {JwtService} from '../services/jwt.service';
import {inject} from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const jwtService = inject(JwtService);

  if (jwtService.hasToken()) {
    const clonedReq = req.clone({
      setHeaders: { Authorization: `${jwtService.getToken()}` }
    });
    return next(clonedReq);
  }

  return next(req);
};
