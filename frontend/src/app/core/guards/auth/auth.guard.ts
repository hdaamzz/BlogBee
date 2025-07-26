import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  return authService.getProfile().pipe(
    take(1),
    map(response => {
      if (response.success) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};

export const nonAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isCurrentlyAuth = authService.isAuthenticated();
  
  if (!isCurrentlyAuth) {
    return true;
  }

  return authService.getProfile().pipe(
    take(1),
    map(response => {
      if (!response.success) {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    })
  );
};
