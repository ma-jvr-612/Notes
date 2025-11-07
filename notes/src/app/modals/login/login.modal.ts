import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login.modal.html',
  styleUrls: ['./login.modal.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class LoginModal implements OnInit {
  email: string = '';
  password: string = '';
  name: string = '';
  isLogin: boolean = true;

  constructor(
    private modalController: ModalController,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    // No longer need to load all users for display
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
  }

  continue() {
    if (this.isLogin) {
      // Login mode - only need email and password
      if (this.email && this.password) {
        this.modalController.dismiss(
          {
            email: this.email,
            password: this.password,
            isLogin: true,
          },
          'login'
        );
      }
    } else {
      // Register mode - need email, password, and name
      if (this.email && this.password && this.name) {
        this.modalController.dismiss(
          {
            email: this.email,
            password: this.password,
            name: this.name,
            isLogin: false,
          },
          'register'
        );
      }
    }
  }
}
