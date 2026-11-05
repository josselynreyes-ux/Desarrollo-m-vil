
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  initializeApp,
  getApps,
  getApp
} from 'firebase/app';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

import { environment } from '../../environments/environment';

// Inicializar Firebase una sola vez.
const app = getApps().length
  ? getApp()
  : initializeApp(environment.firebase);

// Inicializar autenticación.
const auth = getAuth(app);

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Mantiene informado al proyecto sobre el usuario autenticado.
  user$ = new Observable<User | null>((subscriber) => {

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => subscriber.next(user),
      (error) => subscriber.error(error)
    );

    return unsubscribe;
  });

  // Registrar un usuario.
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
  }

  // Iniciar sesión.
  login(email: string, password: string) {
    return signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  }

  // Cerrar sesión.
  logout() {
    return signOut(auth);
  }
}