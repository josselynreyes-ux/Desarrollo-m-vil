import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonInput,
  IonButton,
  IonText
} from '@ionic/angular';

import { FormsModule } from '@angular/forms';
import { DatosService } from '../services/datos';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonInput,
    IonButton,
    IonText,
    CommonModule
  ],
})
export class Tab2Page {

  descuento: number = 0;
  dineroRecibido: number | null = null;

  totalFinal: number = 0;
  cambio: number = 0;
  saldoPendiente: number = 0;

  calculado: boolean = false;

  constructor(public datosService: DatosService) {}

  calcularPago() {

    if (
      !Number.isFinite(Number(this.descuento)) ||
      this.descuento < 0 ||
      this.descuento > 100
    ) {
      alert('El descuento debe estar entre 0 y 100');
      return;
    }

    if (
      this.dineroRecibido === null ||
      !Number.isFinite(Number(this.dineroRecibido)) ||
      Number(this.dineroRecibido) < 0
    ) {
      alert('El dinero recibido debe ser mayor o igual a cero');
      return;
    }

    const subtotal = this.datosService.subtotal;
    const valorDescuento = subtotal * (Number(this.descuento) / 100);

    this.totalFinal = Number((subtotal - valorDescuento).toFixed(2));

    const diferencia = Number(this.dineroRecibido) - this.totalFinal;

    this.cambio = Math.max(0, Number(diferencia.toFixed(2)));
    this.saldoPendiente = Math.max(0, Number((-diferencia).toFixed(2)));

    this.calculado = true;
  }
}
