import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, timeout } from 'rxjs';

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
  IonText,
  IonIcon
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

import { DisneyService } from '../services/disney.service';
import { FavoritesService } from '../services/favorites';
import { DisneyCharacter } from '../models/disney.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
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
    IonText,
    IonIcon
  ]
})
export class DetailPage implements OnInit {

  private route = inject(ActivatedRoute);
  private disneyService = inject(DisneyService);
  private favoritesService = inject(FavoritesService);
  private cdr = inject(ChangeDetectorRef);

  character?: DisneyCharacter;

  loading = true;
  errorMessage = '';
  isFavorite = false;

  constructor() {
    addIcons({ heart, heartOutline });
  }

  ngOnInit(): void {
    void this.loadCharacter();
  }

  async loadCharacter(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    this.character = undefined;

    try {
      const idParam = this.route.snapshot.paramMap.get('id');
      const id = Number(idParam);

      if (!idParam || !Number.isInteger(id) || id <= 0) {
        throw new Error('El identificador del personaje no es válido.');
      }

      // Espera como máximo 10 segundos por la respuesta de la API.
      const response = await firstValueFrom(
        this.disneyService.getCharacterById(id).pipe(
          timeout({ first: 10000 })
        )
      );

      const data = response?.data;

      this.character = Array.isArray(data)
        ? data[0]
        : data ?? undefined;

      if (!this.character) {
        throw new Error('La API no devolvió información del personaje.');
      }

      this.isFavorite = await this.favoritesService.isFavorite(
        this.character._id
      );

    } catch (error) {
      console.error('Error al cargar el detalle:', error);

      this.errorMessage =
        'No se pudo cargar el personaje. Comprueba tu conexión e inténtalo nuevamente.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async toggleFavorite(): Promise<void> {
    if (!this.character) {
      return;
    }

    try {
      await this.favoritesService.toggleFavorite(
        this.character._id
      );

      this.isFavorite = await this.favoritesService.isFavorite(
        this.character._id
      );

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al actualizar el favorito:', error);
    }
  }
}