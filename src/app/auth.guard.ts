import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';

import { AuthService } from './services/auth.service';

// Proteger las páginas internas.
export const authGuard: CanActivateFn = async () => {

  const auth = inject(AuthService);
  const router = inject(Router);

  const user = await firstValueFrom(
    auth.user$.pipe(take(1))
  );

  if (user) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

// Evitar que un usuario autenticado vuelva al login.
export const guestGuard: CanActivateFn = async () => {

  const auth = inject(AuthService);
  const router = inject(Router);

  const user = await firstValueFrom(
    auth.user$.pipe(take(1))
  );

  if (user) {
    return router.createUrlTree(['/inicio']);
  }

  return true;
};