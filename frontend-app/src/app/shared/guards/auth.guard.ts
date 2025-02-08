import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkToken().pipe(
    map((res) => {
      if (res.isLoggedIn) {
        return true;
      } else {
        router.navigate(['/auth']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/auth']);
      return of(false);
    })
  );
};
