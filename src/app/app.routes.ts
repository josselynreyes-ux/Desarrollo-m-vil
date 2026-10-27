import { Routes } from '@angular/router';

export const routes: Routes = [
  // Abre Disney Explorer al iniciar la aplicación.
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then(m => m.HomePage)
  },

  // Abre el detalle según el identificador del personaje.
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./detail/detail.page').then(m => m.DetailPage)
  },

  // Abre la página de favoritos persistentes.
  {
    path: 'favorites',
    loadComponent: () =>
      import('./favorites/favorites.page').then(m => m.FavoritesPage)
  },

  // Redirige la ruta inicial al listado.
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  // Redirige las rutas desconocidas al listado.
  {
    path: '**',
    redirectTo: 'home'
  }
];