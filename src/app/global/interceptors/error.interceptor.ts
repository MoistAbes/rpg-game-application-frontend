import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {catchError, finalize} from 'rxjs';
import {Router} from '@angular/router';
import {JwtService} from '../services/jwt.service';
import {LoadingService} from '../services/loading.service';
import {CharacterLocalService} from '../services/character-local.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);  // Inject Router
  const toastr = inject(ToastrService); // Inject ToastrService
  const jwtService = inject(JwtService);
  const loadingService = inject(LoadingService); // Inject LoadingService
  const characterLocalService = inject(CharacterLocalService)

  // Check if the request has the "X-Skip-Loading" header
  const showLoadingScreen = !req.headers.has('X-Skip-Loading');
  if (showLoadingScreen) {
    loadingService.show();
  }

  return next(req).pipe(
    finalize(() => loadingService.hide()), // Always hide loading after request
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 400:
          toastr.error('Bad Request. Please check your input.');
          break;
        case 401:
          jwtService.removeToken()
          characterLocalService.removeCharacterData();
          router.navigate(['/login']);  // Redirect to login page
          toastr.warning('Unauthorized. Please log in again.');

          break;
        case 403:
          toastr.error('Forbidden. You do not have permission.');
          break;
        case 404:
          toastr.error('Not Found. The requested resource could not be found.');
          break;
        case 503:
          toastr.error(error.error.message);
          break;
        default:
          toastr.error('An unknown error occurred.');
      }
      throw error; // Rethrow the error
    })
  );
};
