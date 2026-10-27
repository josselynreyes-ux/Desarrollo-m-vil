import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonText
} from '@ionic/angular';

import { DisneyService } from '../services/disney.service';
import { FavoritesService } from '../services/favorites';
import { DisneyCharacter } from '../models/disney.model';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonText
  ]
})
export class FavoritesPage implements OnInit {

  private disneyService = inject(DisneyService);
  private favoritesService = inject(FavoritesService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  characters: DisneyCharacter[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    void this.loadFavorites();
  }

  // Actualiza los favoritos cada vez que se entra en esta página.
  ionViewWillEnter(): void {
    void this.loadFavorites();
  }

  // Recupera los identificadores guardados y sus personajes.
  async loadFavorites(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      const ids = await this.favoritesService.getFavorites();

      const results = await Promise.all(
        ids.map(async (id) => {
          try {
            const response = await firstValueFrom(
              this.disneyService.getCharacterById(Number(id))
            );

            const data = response?.data;

            return Array.isArray(data)
              ? data[0] ?? null
              : data ?? null;
          } catch (error) {
            console.error(
              `No se pudo recuperar el personaje ${id}:`,
              error
            );

            return null;
          }
        })
      );

      this.characters = results.filter(
        (character): character is DisneyCharacter =>
          character !== null
      );

    } catch (error) {
      console.error('Error al recuperar favoritos:', error);
      this.errorMessage = 'No se pudieron cargar los favoritos.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  // Abre el detalle del personaje.
  openDetails(character: DisneyCharacter): void {
    void this.router.navigate(['/detail', character._id]);
  }

  // Quita un favorito y actualiza la pantalla.
  async removeFavorite(character: DisneyCharacter): Promise<void> {
    try {
      await this.favoritesService.toggleFavorite(character._id);
      await this.loadFavorites();
    } catch (error) {
      console.error('Error al quitar favorito:', error);
    }
  }
}