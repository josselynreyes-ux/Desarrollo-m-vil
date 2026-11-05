import type { Routes } from '@angular/router';

import {
  authGuard,
  guestGuard
} from './auth.guard';

export const routes: Routes = [

  // Pantalla de acceso.
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/acceso/acceso.page')
        .then(m => m.AccesoPage),
    canActivate: [guestGuard]
  },

  // Página principal.
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page')
        .then(m => m.HomePage),
    canActivate: [authGuard]
  },

  // Inicio de UrbanInspect.
  {
    path: 'inicio',
    loadComponent: () =>
      import('./pages/inicio/inicio.page')
        .then(m => m.InicioPage),
    canActivate: [authGuard]
  },

  // Consulta de incidencias.
  {
    path: 'incidencias',
    loadComponent: () =>
      import('./pages/incidencias/incidencias.page')
        .then(m => m.IncidenciasPage),
    canActivate: [authGuard]
  },

  // Detalle de una incidencia.
  {
    path: 'incidencias/:id',
    loadComponent: () =>
      import('./pages/detalle-incidencia/detalle-incidencia.page')
        .then(m => m.DetalleIncidenciaPage),
    canActivate: [authGuard]
  },

  // Registro de incidencias.
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro.page')
        .then(m => m.RegistroPage),
    canActivate: [authGuard]
  },

  // Ruta inicial.
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Rutas inexistentes.
  {
    path: '**',
    redirectTo: 'login'
  }

];