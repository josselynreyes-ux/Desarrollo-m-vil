import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  nombre: string = '';
  cantidad: number = 0;
  precio: number = 0;
  subtotal: number = 0;

  guardarCompra(compra: {
    nombre: string;
    cantidad: number;
    precio: number;
    subtotal: number;
  }) {
    this.nombre = compra.nombre;
    this.cantidad = compra.cantidad;
    this.precio = compra.precio;
    this.subtotal = compra.subtotal;
  }
}
