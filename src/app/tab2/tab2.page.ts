import { Component, inject } from '@angular/core';
// CHANGE: Import the Ionic standalone components used on this page
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonFab,
  IonFabButton,
  IonIcon,
  ActionSheetController // NUEVO: Importar controlador para el menú de borrado
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import { camera, trash, close } from 'ionicons/icons'; // NUEVO: Importar íconos trash y close
// CHANGE: Import the PhotoService
import { PhotoService, type UserPhoto } from '../services/photo.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  // CHANGE: Add the standalone component imports
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon,IonGrid, IonRow, IonCol],
})
export class Tab2Page {
  // CHANGE: Inject the PhotoService
  public photoService = inject(PhotoService);
  // NUEVO: Inyectar ActionSheetController
  public actionSheetController = inject(ActionSheetController);

  constructor() {
    // CHANGE: Register the icons this page uses
    addIcons({ camera, trash, close }); // NUEVO: Registrar los nuevos íconos
  }

  async addPhotoToGallery(){
    await this.photoService.addNewToGallery();
  }

  // mostrar un menú inferior al hacer clic en una foto para confirmar eliminación
  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Fotos',
      buttons: [{
        text: 'Eliminar',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePhoto(position);
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // No hace nada, solo cierra el menú
        }
      }]
    });
    await actionSheet.present();
  }
}