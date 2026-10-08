import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatosService {
  nombre = signal('');
  contador = signal(0);
  direccion = signal('');
  edad = signal(0);
  enviado = signal(false);

  guardar(nombre: string, direccion:string, edad: number, contador: number): void {
    this.nombre.set(nombre);
    this.contador.set(contador);
    this.direccion.set(direccion);
    this.edad.set(edad);
    this.enviado.set(true);
  }
}