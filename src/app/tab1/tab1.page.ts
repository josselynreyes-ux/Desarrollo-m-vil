import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonIcon, IonGrid, IonRow, IonCol, IonChip, IonLabel
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  schoolOutline, calendarOutline, peopleCircleOutline,
  checkmarkDoneCircleOutline, phonePortraitOutline, homeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    DatePipe, RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonIcon, IonGrid, IonRow, IonCol, IonChip, IonLabel
  ],
})
export class Tab1Page {
  fechaActual: Date = new Date();
  integrantes: string[] = ['Paladines Justin', 'Reyes Josselyn'];

  constructor() {
    addIcons({
      schoolOutline,
      calendarOutline,
      peopleCircleOutline,
      checkmarkDoneCircleOutline,
      phonePortraitOutline,
      homeOutline
    });
  }
}