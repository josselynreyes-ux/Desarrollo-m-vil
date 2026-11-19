import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonSearchbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonInfiniteScroll, IonInfiniteScrollContent,
  IonIcon, IonSpinner, IonButton, IonText
} from '@ionic/angular';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personCircleOutline, mailOutline, callOutline, alertCircleOutline, refreshOutline } from 'ionicons/icons';
import { UsuariosService, Usuario } from '../services/usuarios';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonSearchbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonInfiniteScroll, IonInfiniteScrollContent,
    IonIcon, IonSpinner, IonButton, IonText
  ],
})
export class Tab3Page implements OnInit {
  todosLosUsuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  usuariosMostrados: Usuario[] = [];

  terminoBusqueda: string = '';
  cargando: boolean = false;
  errorCarga: boolean = false;
  scrollDeshabilitado: boolean = false;

  private readonly TAMANO_LOTE = 4;

  constructor(
    private usuariosService: UsuariosService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ personCircleOutline, mailOutline, callOutline, alertCircleOutline, refreshOutline });
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  // También se ejecuta al ingresar a la pestaña según el ciclo de vida de Ionic
  ionViewWillEnter() {
    if (this.todosLosUsuarios.length === 0 && !this.cargando) {
      this.cargarUsuarios();
    }
  }

  cargarUsuarios() {
    this.cargando = true;
    this.errorCarga = false;
    this.cdr.detectChanges();

    this.usuariosService.obtenerUsuarios().subscribe({
      next: (datos) => {
        this.todosLosUsuarios = datos;
        this.aplicarFiltroYReiniciarPaginacion();
        this.cargando = false;
        this.cdr.detectChanges(); // Fuerza el pintado inmediato de los 4 primeros usuarios
      },
      error: (err) => {
        console.error('Error al consultar JSONPlaceholder:', err);
        this.errorCarga = true;
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  buscarUsuario(event: any) {
    this.terminoBusqueda = (event.target.value || '').toLowerCase().trim();
    this.aplicarFiltroYReiniciarPaginacion();
    this.cdr.detectChanges();
  }

  private aplicarFiltroYReiniciarPaginacion() {
    if (this.terminoBusqueda === '') {
      this.usuariosFiltrados = [...this.todosLosUsuarios];
    } else {
      this.usuariosFiltrados = this.todosLosUsuarios.filter((u) =>
        u.name.toLowerCase().includes(this.terminoBusqueda)
      );
    }

    this.usuariosMostrados = this.usuariosFiltrados.slice(0, this.TAMANO_LOTE);
    this.actualizarEstadoScroll();
  }

  cargarMas(event: InfiniteScrollCustomEvent) {
    setTimeout(() => {
      const cantidadActual = this.usuariosMostrados.length;
      const siguientes = this.usuariosFiltrados.slice(
        cantidadActual,
        cantidadActual + this.TAMANO_LOTE
      );

      this.usuariosMostrados = [...this.usuariosMostrados, ...siguientes];
      this.actualizarEstadoScroll();

      event.target.complete();
      this.cdr.detectChanges();
    }, 400);
  }

  private actualizarEstadoScroll() {
    this.scrollDeshabilitado = this.usuariosMostrados.length >= this.usuariosFiltrados.length;
  }
}