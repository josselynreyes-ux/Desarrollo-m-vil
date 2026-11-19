import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonDatetime, IonDatetimeButton, IonModal,
  IonRadioGroup, IonRadio, IonCheckbox, IonButton,
  IonList, IonBadge, IonIcon, IonText,
  ToastController, AlertController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline, checkmarkCircleOutline, ellipseOutline, addCircleOutline } from 'ionicons/icons';
import { ActividadesService, Actividad } from '../services/actividades';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption,
    IonDatetime, IonDatetimeButton, IonModal,
    IonRadioGroup, IonRadio, IonCheckbox, IonButton,
    IonList, IonBadge, IonIcon, IonText
  ],
})
export class Tab2Page implements OnInit, OnDestroy {
  actividadForm: FormGroup;
  actividades: Actividad[] = [];
  tiposActividad = ['Tarea', 'Proyecto', 'Examen', 'Investigación', 'Taller'];
  prioridades = ['Alta', 'Media', 'Baja'];
  fechaDefault: string = new Date().toISOString().split('T')[0];
  private sub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private actividadesService: ActividadesService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    addIcons({ trashOutline, checkmarkCircleOutline, ellipseOutline, addCircleOutline });

    // Configuración exacta de validaciones según el documento
    this.actividadForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      tipo: ['', Validators.required],
      fechaEntrega: [this.fechaDefault, Validators.required],
      prioridad: ['', Validators.required],
      completada: [false]
    });
  }

  ngOnInit() {
    this.sub = this.actividadesService.obtenerActividades().subscribe({
      next: (datos) => {
        this.actividades = datos;
      },
      error: (err) => {
        console.error('Error al cargar actividades:', err);
        this.mostrarToast('Error al conectar con Firestore. Revisa tu configuración.', 'danger');
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  // Guardar nueva actividad
  async guardarActividad() {
    if (this.actividadForm.invalid) {
      this.actividadForm.markAllAsTouched();
      this.mostrarToast('Completa correctamente todos los campos obligatorios.', 'warning');
      return;
    }

    try {
      const formValue = this.actividadForm.value;
      // Formatear fecha limpia YYYY-MM-DD
      const fechaFormateada = typeof formValue.fechaEntrega === 'string'
        ? formValue.fechaEntrega.split('T')[0]
        : this.fechaDefault;

      const nuevaActividad: Omit<Actividad, 'id'> = {
        titulo: formValue.titulo.trim(),
        descripcion: formValue.descripcion.trim(),
        tipo: formValue.tipo,
        fechaEntrega: fechaFormateada,
        prioridad: formValue.prioridad,
        completada: Boolean(formValue.completada)
      };

      await this.actividadesService.crearActividad(nuevaActividad);
      this.mostrarToast('Actividad registrada exitosamente en Firestore.', 'success');

      // Reiniciar formulario manteniendo valores por defecto
      this.actividadForm.reset({
        titulo: '',
        descripcion: '',
        tipo: '',
        fechaEntrega: this.fechaDefault,
        prioridad: '',
        completada: false
      });
    } catch (error) {
      console.error(error);
      this.mostrarToast('Ocurrió un error al guardar la actividad.', 'danger');
    }
  }

  // Actualizar estado completada/pendiente
  async cambiarEstado(actividad: Actividad) {
    if (!actividad.id) return;
    try {
      const nuevoEstado = !actividad.completada;
      await this.actividadesService.actualizarEstado(actividad.id, nuevoEstado);
      this.mostrarToast(
        nuevoEstado ? 'Actividad marcada como completada.' : 'Actividad marcada como pendiente.',
        'primary'
      );
    } catch (error) {
      this.mostrarToast('Error al actualizar el estado.', 'danger');
    }
  }

  // Confirmar y eliminar actividad
  async confirmarEliminacion(actividad: Actividad) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de eliminar la actividad <strong>"${actividad.titulo}"</strong>?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            if (!actividad.id) return;
            try {
              await this.actividadesService.eliminarActividad(actividad.id);
              this.mostrarToast('Actividad eliminada correctamente.', 'success');
            } catch (error) {
              this.mostrarToast('No se pudo eliminar la actividad.', 'danger');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  // Helper para el color del ion-badge
  obtenerColorPrioridad(prioridad: string): string {
    switch (prioridad) {
      case 'Alta': return 'danger';
      case 'Media': return 'warning';
      case 'Baja': return 'success';
      default: return 'medium';
    }
  }

  // Helper para mostrar ion-toast
  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2500,
      position: 'bottom',
      color
    });
    await toast.present();
  }
}