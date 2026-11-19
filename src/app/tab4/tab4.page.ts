import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonItem, IonInput, IonButton, IonIcon, IonText, IonBadge,
  ToastController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  speedometerOutline, playOutline, stopOutline,
  personOutline, saveOutline, warningOutline
} from 'ionicons/icons';
import { DispositivoService, LecturaAcelerometro } from '../services/dispositivo';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonItem, IonInput, IonButton, IonIcon, IonText, IonBadge
  ],
})
export class Tab4Page implements OnInit, OnDestroy {
  ejes: LecturaAcelerometro = { x: 0, y: 0, z: 0 };
  sensorActivo: boolean = false;
  mensajeSensor: string = '';

  nombreEstudiante: string = '';
  nombreGuardado: string = '';

  constructor(
    private dispositivoService: DispositivoService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private toastCtrl: ToastController
  ) {
    addIcons({
      speedometerOutline, playOutline, stopOutline,
      personOutline, saveOutline, warningOutline
    });
  }

  async ngOnInit() {
    await this.cargarNombreGuardado();
  }

  async ionViewWillEnter() {
    await this.cargarNombreGuardado();
  }

  async ionViewWillLeave() {
    await this.detenerLectura();
  }

  async ngOnDestroy() {
    await this.detenerLectura();
  }

  async iniciarLectura() {
    this.mensajeSensor = '';

    const iniciado = await this.dispositivoService.iniciarAcelerometro(
      (datos) => {
        this.ngZone.run(() => {
          this.ejes = datos;
          this.cdr.detectChanges();
        });
      },
      (errorMsg) => {
        this.ngZone.run(() => {
          this.sensorActivo = false;
          this.mensajeSensor = errorMsg;
          this.cdr.detectChanges();
        });
      }
    );

    if (iniciado) {
      this.sensorActivo = true;
      this.cdr.detectChanges();

      setTimeout(() => {
        if (this.sensorActivo && this.ejes.x === 0 && this.ejes.y === 0 && this.ejes.z === 0) {
          this.mensajeSensor =
            'Sensor iniciado, pero no se detecta hardware físico de acelerómetro (común en navegadores de PC). Pruébalo en un móvil físico.';
          this.cdr.detectChanges();
        }
      }, 1500);
    }
  }

  async detenerLectura() {
    await this.dispositivoService.detenerAcelerometro();
    this.sensorActivo = false;
    this.cdr.detectChanges();
  }

  async cargarNombreGuardado() {
    const guardado = await this.dispositivoService.obtenerNombreEstudiante();
    this.nombreGuardado = guardado;
    this.nombreEstudiante = guardado;
    this.cdr.detectChanges(); // Fuerza que aparezca al instante tras F5
  }

  async guardarNombre() {
    const limpio = this.nombreEstudiante.trim();
    if (!limpio) {
      this.mostrarToast('Escribe un nombre antes de guardar.', 'warning');
      return;
    }

    await this.dispositivoService.guardarNombreEstudiante(limpio);
    this.nombreGuardado = limpio;
    this.cdr.detectChanges();
    this.mostrarToast('Nombre guardado en almacenamiento local.', 'success');
  }

  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2200,
      position: 'bottom',
      color,
    });
    await toast.present();
  }
}