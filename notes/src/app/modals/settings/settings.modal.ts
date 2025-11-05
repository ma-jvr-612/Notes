import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings.modal.html',
  styleUrls: ['./settings.modal.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SettingsModal implements OnInit {
  darkModeEnabled = false;

  constructor(
    private modalController: ModalController,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.darkModeEnabled = this.themeService.isDarkMode();
  }

  onThemeToggle(event: any) {
    this.themeService.setDarkMode(event.detail.checked);
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
