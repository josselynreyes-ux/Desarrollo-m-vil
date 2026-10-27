import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  inject
} from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSearchbar,
  IonButton,
  IonText,
  IonButtons,
  IonIcon
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

import { DisneyService } from '../services/disney.service';
import { FavoritesService } from '../services/favorites';
import { DisneyCharacter } from '../models/disney.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSearchbar,
    IonButton,
    IonText,
    IonButtons,
    IonIcon,
    RouterLink
  ]
})
export class HomePage implements OnInit, OnDestroy {

  private disneyService = inject(DisneyService);
  private favoritesService = inject(FavoritesService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild(IonInfiniteScroll)
  infiniteScroll?: IonInfiniteScroll;

  characters: DisneyCharacter[] = [];

  searchInput = '';
  searchTerm = '';

  currentPage = 1;
  totalPages = 1;

  loading = false;
  hasMore = true;

  errorMessage = '';
  infiniteError = false;

  imageErrorIds = new Set<number>();
  favoriteIds = new Set<number>();

  private activeRequest?: Subscription;
  private pendingInfiniteEvent?: any;

  constructor() {
    addIcons({ heart, heartOutline });
  }

  ngOnInit(): void {
    void this.loadFavorites();
    this.loadCharacters();
  }

  // Actualiza el texto de búsqueda mientras se escribe.
  onSearchInput(event: any): void {
    this.searchInput = event.detail.value ?? '';
  }

  // Vuelve a cargar los favoritos al regresar a esta página.
  ionViewWillEnter(): void {
    void this.loadFavorites();
  }

  // Reinicia los resultados y ejecuta la búsqueda.
  searchCharacters(): void {
    const newTerm = this.searchInput.trim();

    if (
      newTerm === this.searchTerm &&
      this.characters.length > 0
    ) {
      return;
    }

    this.activeRequest?.unsubscribe();
    this.finishPendingInfiniteEvent();

    this.characters = [];
    this.currentPage = 1;
    this.totalPages = 1;
    this.hasMore = true;

    this.errorMessage = '';
    this.infiniteError = false;
    this.imageErrorIds.clear();

    this.searchTerm = newTerm;
    this.loading = false;

    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = false;
    }

    this.cdr.detectChanges();
    this.loadCharacters();
  }

  // Recupera los favoritos guardados en el dispositivo.
  async loadFavorites(): Promise<void> {
    try {
      const ids = await this.favoritesService.getFavorites();

      this.favoriteIds = new Set(
        ids.map(id => Number(id))
      );
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
    } finally {
      this.cdr.detectChanges();
    }
  }

  // Agrega o elimina un personaje de favoritos.
  async toggleFavorite(character: DisneyCharacter): Promise<void> {
    try {
      await this.favoritesService.toggleFavorite(character._id);
      await this.loadFavorites();
    } catch (error) {
      console.error('Error al actualizar favoritos:', error);
    }
  }

  // Abre el detalle del personaje seleccionado.
  openDetails(character: DisneyCharacter): void {
    void this.router.navigate(['/detail', character._id]);
  }

  // Solicita una página de personajes a la API.
  loadCharacters(event?: any): void {
    if (this.loading || !this.hasMore) {
      event?.target.complete();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    if (event) {
      this.pendingInfiniteEvent = event;
      this.infiniteError = false;
    }

    const requestedPage = this.currentPage;

    this.activeRequest = this.disneyService
      .getCharacters(requestedPage, this.searchTerm, 20)
      .subscribe({
        next: (response) => {
          const data = response?.data;

          const incoming = Array.isArray(data)
            ? data
            : data ? [data] : [];

          const existingIds = new Set(
            this.characters.map(character => character._id)
          );

          const uniqueCharacters = incoming.filter(
            character => !existingIds.has(character._id)
          );

          this.characters = [
            ...this.characters,
            ...uniqueCharacters
          ];

          this.totalPages = response?.info?.totalPages ?? 1;

          this.hasMore =
            Boolean(response?.info?.nextPage) ||
            requestedPage < this.totalPages;

          this.currentPage = requestedPage + 1;

          // Actualiza la pantalla al recibir los datos.
          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('Error en la API de Disney:', error);

          if (event) {
            this.infiniteError = true;
          } else {
            this.errorMessage =
              'No se pudieron cargar los personajes. Inténtalo nuevamente.';
          }

          this.currentPage = requestedPage;
          this.finishLoading(event);
        },

        complete: () => {
          this.finishLoading(event);
        }
      });
  }

  // Finaliza la carga y libera el infinite scroll.
  private finishLoading(event?: any): void {
    this.loading = false;

    const targetEvent = event ?? this.pendingInfiniteEvent;

    if (targetEvent) {
      targetEvent.target.complete();
    }

    if (this.pendingInfiniteEvent === targetEvent) {
      this.pendingInfiniteEvent = undefined;
    }

    if (!this.hasMore && this.infiniteScroll) {
      this.infiniteScroll.disabled = true;
    }

    this.cdr.detectChanges();
  }

  // Finaliza una carga pendiente antes de buscar otra vez.
  private finishPendingInfiniteEvent(): void {
    if (this.pendingInfiniteEvent) {
      this.pendingInfiniteEvent.target.complete();
      this.pendingInfiniteEvent = undefined;
    }

    this.activeRequest?.unsubscribe();
    this.loading = false;
  }

  // Reintenta la carga inicial si falla.
  retry(): void {
    this.errorMessage = '';
    this.infiniteError = false;
    this.loadCharacters();
  }

  // Reintenta la carga de una página adicional.
  retryInfinite(): void {
    this.infiniteError = false;
    this.loadCharacters();
  }

  // Registra las imágenes que no pudieron cargarse.
  onImageError(character: DisneyCharacter): void {
    this.imageErrorIds.add(character._id);
  }

  // Cancela la petición al destruir la página.
  ngOnDestroy(): void {
    this.activeRequest?.unsubscribe();
    this.finishPendingInfiniteEvent();
  }
}