import {APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {authInterceptor} from './global/interceptors/auth.interceptor';
import {provideToastr} from 'ngx-toastr';
import {errorInterceptor} from './global/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {

  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideToastr({ // Provide Toastr globally
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    })
  ]
};
