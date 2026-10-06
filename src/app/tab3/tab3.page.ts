import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard,IonCardContent,IonCardHeader,IonCardSubtitle,IonCardTitle,IonItem,IonLabel,IonList,IonThumbnail, } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent,IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonItem,
    IonLabel,
    IonList,
    IonThumbnail,],
})
export class Tab3Page {
  constructor() {}
}
