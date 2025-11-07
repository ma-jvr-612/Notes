import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ThemeService } from './services/theme.service';
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
  bookmarkOutline,
  bookmarksOutline,
  phonePortraitOutline,
  logInOutline,
  enterOutline,
  logOutOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
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
      bookmarkOutline,
      bookmarksOutline,
      phonePortraitOutline,
      logInOutline,
      enterOutline,
      logOutOutline,
    });
  }
}
