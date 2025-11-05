import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { ThemeService } from '../services/theme.service';
import { SettingsModal } from '../modals/settings/settings.modal';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  constructor(
    private modalController: ModalController,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    // Initialize theme on page load
  }

  async openSettings() {
    const modal = await this.modalController.create({
      component: SettingsModal
    });
    return await modal.present();
  }
}
