import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ThemeService } from './services/theme.service';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  logoIonic,
  add,
  flowerOutline,
  createOutline,
  eyeOutline,
  logoMarkdown,
  brush,
  close,
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, IonIcon],
})
export class AppComponent {
  constructor(private themeService: ThemeService) {
    addIcons({
      logoIonic,
      add,
      flowerOutline,
      createOutline,
      eyeOutline,
      logoMarkdown,
      brush,
      close,
    });
  }
}
