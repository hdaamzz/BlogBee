import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptor/auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
  provideAnimations(),
  provideToastr({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  provideZoneChangeDetection({ eventCoalescing: true }), 
  provideRouter(routes,withPreloading(PreloadAllModules)),
  provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
