import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonicModule,
  ModalController,
  PopoverController,
  AlertController,
} from '@ionic/angular';
import { ThemeService } from '../services/theme.service';
import { SettingsModal } from '../modals/settings/settings.modal';
import { LoginModal } from '../modals/login/login.modal';
import { ForgotPasswordModal } from '../modals/forgot-password/forgot-password.modal';
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
  isLoggedIn: boolean = false;
  userName: string = '';

  constructor(
    private modalController: ModalController,
    private popoverController: PopoverController,
    private alertController: AlertController,
    private themeService: ThemeService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    // Initialize theme on page load
    this.checkAuthState();
  }

  checkAuthState() {
    // Check if user is logged in by checking Firebase auth state
    const currentUser = this.apiService.getCurrentUser();
    const userId = localStorage.getItem('userId');
    this.isLoggedIn = !!(currentUser || userId);

    // Get username from localStorage
    if (this.isLoggedIn) {
      this.userName = localStorage.getItem('userName') || 'User';
    }
  }

  async logout() {
    try {
      // Close the popover
      await this.popoverController.dismiss();

      await this.apiService.logoutUser();
      // Clear localStorage
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      // Update auth state
      this.checkAuthState();
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  async showErrorAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK'],
      cssClass: 'error-alert',
    });

    await alert.present();
  }

  getFirebaseErrorMessage(error: any): string {
    const errorCode = error?.code || '';

    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials.';
      default:
        return (
          error?.message || 'An unexpected error occurred. Please try again.'
        );
    }
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

  async openForgotPassword() {
    const modal = await this.modalController.create({
      component: ForgotPasswordModal,
      cssClass: 'auto-height',
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'reset' && data) {
      try {
        await this.apiService.resetPassword(data.email);
        await this.showSuccessAlert(
          'Password Reset Email Sent',
          'Please check your email for instructions to reset your password.'
        );
      } catch (error) {
        console.error('Error sending password reset email:', error);
        const errorMessage = this.getFirebaseErrorMessage(error);
        await this.showErrorAlert('Password Reset Failed', errorMessage);
      }
    }
  }

  async showSuccessAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK'],
      cssClass: 'success-alert',
    });

    await alert.present();
  }

  async openLogin() {
    const modal = await this.modalController.create({
      component: LoginModal,
      cssClass: 'auto-height',
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'forgot-password') {
      // User clicked "Forgot Password?" - open forgot password modal
      await this.openForgotPassword();
      return;
    }

    if (role === 'register' && data && !data.isLogin) {
      // Register new user with Firebase Auth
      try {
        const user = await this.apiService.registerUser(
          data.email,
          data.password,
          data.name
        );
        console.log('User registered successfully:', user);
        // Store user ID in localStorage for future requests
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userName', data.name);
        localStorage.setItem('userEmail', data.email);
        // Update auth state
        this.checkAuthState();
      } catch (error) {
        console.error('Error registering user:', error);
        const errorMessage = this.getFirebaseErrorMessage(error);
        await this.showErrorAlert('Registration Failed', errorMessage);
      }
    } else if (role === 'login' && data && data.isLogin) {
      // Login existing user with Firebase Auth
      try {
        const user = await this.apiService.loginUser(data.email, data.password);
        console.log('User logged in successfully:', user);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);
        // Update auth state
        this.checkAuthState();
      } catch (error) {
        console.error('Error logging in:', error);
        const errorMessage = this.getFirebaseErrorMessage(error);
        await this.showErrorAlert('Login Failed', errorMessage);
      }
    }
  }
}
