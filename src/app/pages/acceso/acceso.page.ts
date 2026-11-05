import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonText,
  IonCard,
  IonCardContent,
  IonSpinner
} from '@ionic/angular';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-acceso',
  templateUrl: './acceso.page.html',
  styleUrls: ['./acceso.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonText,
    IonCard,
    IonCardContent,
    IonSpinner
  ]
})
export class AccesoPage {

  email = '';
  password = '';

  modoRegistro = false;
  error = '';
  mensaje = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  cambiarModo() {
    this.modoRegistro = !this.modoRegistro;
    this.error = '';
    this.mensaje = '';
  }

  async acceder() {

    if (!this.email.trim() || !this.password) {
      this.error = 'Completa todos los campos.';
      return;
    }

    this.loading = true;
    this.error = '';

    try {

      if (this.modoRegistro) {

        if (this.password.length < 6) {
          this.error =
            'La contraseña debe tener al menos 6 caracteres.';
          return;
        }

        await this.auth.register(
          this.email.trim(),
          this.password
        );

      } else {

        await this.auth.login(
          this.email.trim(),
          this.password
        );

      }

      await this.router.navigateByUrl('/inicio', {
        replaceUrl: true
      });

    } catch (err: any) {

      console.error('Error de autenticación:', err);

      switch (err.code) {

        case 'auth/email-already-in-use':
          this.error = 'Este correo ya está registrado.';
          break;

        case 'auth/invalid-email':
          this.error = 'El correo electrónico no es válido.';
          break;

        case 'auth/weak-password':
          this.error = 'La contraseña es demasiado débil.';
          break;

        case 'auth/invalid-credential':
          this.error = 'Correo o contraseña incorrectos.';
          break;

        case 'auth/user-not-found':
          this.error = 'No existe una cuenta con este correo.';
          break;

        case 'auth/wrong-password':
          this.error = 'La contraseña es incorrecta.';
          break;

        case 'auth/too-many-requests':
          this.error =
            'Demasiados intentos. Inténtalo más tarde.';
          break;

        default:
          this.error = this.modoRegistro
            ? 'No se pudo crear la cuenta. Inténtalo nuevamente.'
            : 'No se pudo iniciar sesión. Verifica tus datos.';
      }

    } finally {
      this.loading = false;
    }
  }
}