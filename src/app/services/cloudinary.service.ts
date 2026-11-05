import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  private cloudName = environment.cloudinary.cloudName;
  private uploadPreset = environment.cloudinary.uploadPreset;

  async subirFotografia(fotografia: string): Promise<string> {

    // Si ya es una dirección web no necesitamos subirla otra vez.
    if (fotografia.startsWith('http')) {
      return fotografia;
    }

    // Comprobamos que sea una imagen en formato Base64.
    if (!fotografia.startsWith('data:image/')) {
      throw new Error('El formato de la fotografía no es válido.');
    }

    // Dirección de Cloudinary para subir imágenes.
    const direccion =
      `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

    // Preparamos los datos que recibirá Cloudinary.
    const datos = new FormData();

    datos.append('file', fotografia);
    datos.append('upload_preset', this.uploadPreset);

    // Enviamos la fotografía.
    const respuesta = await fetch(direccion, {
      method: 'POST',
      body: datos
    });

    if (!respuesta.ok) {
      const detalle = await respuesta.text();

      console.error('Error de Cloudinary:', detalle);

      throw new Error('No se pudo subir la fotografía a Cloudinary.');
    }

    const resultado = await respuesta.json();

    // Cloudinary debe devolver una dirección segura.
    if (!resultado.secure_url) {
      throw new Error('Cloudinary no devolvió la dirección de la imagen.');
    }

    return resultado.secure_url;
  }
}