import { Router } from '@angular/router';
import { DatosService } from '../services/datos';
import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonInput,
  IonButton
} from '@ionic/angular';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonItem,
    IonInput,
    IonButton
  ],
})

export class Tab1Page {

  nombre: string = '';
  cantidad: number | null = null;
  precio: number | null = null;

  constructor(
    private datosService: DatosService,
    private router: Router
  ) {}

  registrarCompra() {

    if (this.nombre.trim() === '') {
      alert('Ingresa el nombre del producto');
      return;
    }

    if (
      this.cantidad === null ||
      !Number.isInteger(Number(this.cantidad)) ||
      Number(this.cantidad) <= 0
    ) {
      alert('La cantidad debe ser un entero mayor que cero');
      return;
    }

    if (
      this.precio === null ||
      !Number.isFinite(Number(this.precio)) ||
      Number(this.precio) <= 0
    ) {
      alert('El precio debe ser mayor que cero');
      return;
    }

    const subtotal = Number(this.cantidad) * Number(this.precio);


      this.datosService.guardarCompra({
        nombre: this.nombre.trim(),
        cantidad: Number(this.cantidad),
        precio: Number(this.precio),
        subtotal: subtotal
      });

      this.router.navigate(['/tabs/tab2']);
  }
}
