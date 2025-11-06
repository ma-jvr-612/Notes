import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { ThemeService } from '../services/theme.service';
import { SettingsModal } from '../modals/settings/settings.modal';
import { LoginModal } from '../modals/login/login.modal';
import { ApiService } from '../services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { ConceptComponent } from '../concept/concept.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, IonicModule, HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage implements OnInit {
  constructor(
    private modalController: ModalController,
    private themeService: ThemeService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    // Initialize theme on page load
  }

  async openConcept() {
    const modal = await this.modalController.create({
      component: ConceptComponent,
    });
    return await modal.present();
  }

  async openSettings() {
    const modal = await this.modalController.create({
      component: SettingsModal,
    });
    return await modal.present();
  }

  async openLogin() {
    const modal = await this.modalController.create({
      component: LoginModal,
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'register' && data && !data.isLogin) {
      // Register new user in D1 database
      this.apiService.createUser(data.email, data.name).subscribe({
        next: (response) => {
          console.log('User registered successfully:', response);
          // Store user ID in localStorage for future requests
          localStorage.setItem('userId', response.user.id.toString());
          localStorage.setItem('userName', data.name);
          localStorage.setItem('userEmail', data.email);
        },
        error: (error) => {
          console.error('Error registering user:', error);
        },
      });
    } else if (role === 'login' && data && data.isLogin) {
      // Login existing user - fetch from D1 database
      console.log('User attempting login:', data.email);
      // TODO: Implement user lookup by email
      // For now, just store the email
      localStorage.setItem('userEmail', data.email);
    }
  }
}
