import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  // Nombre de la clave utilizada para guardar los favoritos.
  private storageKey = 'disney_favorites';

  // Obtiene los identificadores guardados en el dispositivo.
  async getFavorites(): Promise<number[]> {
    const result = await Preferences.get({
      key: this.storageKey
    });

    // Convierte el contenido almacenado en un arreglo de números.
    return result.value ? JSON.parse(result.value) as number[] : [];
  }

  // Comprueba si un personaje ya está guardado como favorito.
  async isFavorite(id: number): Promise<boolean> {
    const favorites = await this.getFavorites();
    return favorites.includes(id);
  }

  // Agrega un personaje a favoritos o lo elimina si ya existe.
  async toggleFavorite(id: number): Promise<void> {
    const favorites = await this.getFavorites();

    // Quita el identificador si ya existe; de lo contrario, lo agrega.
    const updated = favorites.includes(id)
      ? favorites.filter(favoriteId => favoriteId !== id)
      : [...favorites, id];

    // Persiste la lista actualizada en el dispositivo.
    await Preferences.set({
      key: this.storageKey,
      value: JSON.stringify(updated)
    });
  }
}