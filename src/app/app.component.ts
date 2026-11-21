
import { Component } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  showSplash = true;

  constructor() {

    // Ocultar la pantalla nativa de Android
    if (Capacitor.isNativePlatform()) {
      void SplashScreen.hide();
    }

    // Mostrar nuestra imagen durante 2.5 segundos
    setTimeout(() => {
      this.showSplash = false;
    }, 2500);

  }
}
