import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Motion } from '@capacitor/motion';
import { PluginListenerHandle } from '@capacitor/core';

export interface LecturaAcelerometro {
  x: number;
  y: number;
  z: number;
}

@Injectable({
  providedIn: 'root',
})
export class DispositivoService {
  private readonly CLAVE_NOMBRE = 'smartcampus_nombre_estudiante';
  private accelHandler?: PluginListenerHandle;

  constructor() {}

  // ==========================================
  // A. ACELERÓMETRO (@capacitor/motion)
  // ==========================================
  async iniciarAcelerometro(
    onLectura: (datos: LecturaAcelerometro) => void,
    onError: (mensaje: string) => void
  ): Promise<boolean> {
    try {
      // Solicitar permisos en navegadores iOS / Safari 13+ si aplica
      if (
        typeof DeviceMotionEvent !== 'undefined' &&
        typeof (DeviceMotionEvent as any).requestPermission === 'function'
      ) {
        const permiso = await (DeviceMotionEvent as any).requestPermission();
        if (permiso !== 'granted') {
          onError('Permiso de sensores denegado por el usuario o navegador.');
          return false;
        }
      }

      // Evitar suscripciones duplicadas
      await this.detenerAcelerometro();

      this.accelHandler = await Motion.addListener('accel', (event) => {
        const acc = event.accelerationIncludingGravity || event.acceleration;
        if (acc) {
          onLectura({
            x: Number((acc.x ?? 0).toFixed(2)),
            y: Number((acc.y ?? 0).toFixed(2)),
            z: Number((acc.z ?? 0).toFixed(2)),
          });
        }
      });

      return true;
    } catch (error) {
      console.warn('Acelerómetro no disponible:', error);
      onError(
        'El acelerómetro no está disponible en este dispositivo o navegador. Realiza la prueba en un teléfono móvil físico.'
      );
      return false;
    }
  }

  async detenerAcelerometro(): Promise<void> {
    if (this.accelHandler) {
      await this.accelHandler.remove();
      this.accelHandler = undefined;
    }
  }

  // ==========================================
  // B. ALMACENAMIENTO LOCAL (@capacitor/preferences)
  // ==========================================
  async guardarNombreEstudiante(nombre: string): Promise<void> {
    await Preferences.set({
      key: this.CLAVE_NOMBRE,
      value: nombre,
    });
  }

  async obtenerNombreEstudiante(): Promise<string> {
    const { value } = await Preferences.get({ key: this.CLAVE_NOMBRE });
    return value ?? '';
  }
}