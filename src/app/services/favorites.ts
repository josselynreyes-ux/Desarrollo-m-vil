import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  // Clave usada para guardar los favoritos en el dispositivo.
  private readonly storageKey = 'disney_favorites';

  // Obtiene los identificadores guardados.
  async getFavorites(): Promise<number[]> {
    const result = await Preferences.get({
      key: this.storageKey
    });

    return result.value ? JSON.parse(result.value) as number[] : [];
  }

  // Comprueba si un personaje está guardado como favorito.
  async isFavorite(id: number): Promise<boolean> {
    const favorites = await this.getFavorites();
    return favorites.includes(id);
  }

  // Agrega o elimina un personaje de favoritos.
  async toggleFavorite(id: number): Promise<void> {
    const favorites = await this.getFavorites();
    const updated = favorites.includes(id)
      ? favorites.filter(favoriteId => favoriteId !== id)
      : [...favorites, id];

    await Preferences.set({
      key: this.storageKey,
      value: JSON.stringify(updated)
    });
  }
}