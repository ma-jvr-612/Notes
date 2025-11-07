import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-forgot-password-modal',
  templateUrl: './forgot-password.modal.html',
  styleUrls: ['./forgot-password.modal.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ForgotPasswordModal implements OnInit {
  email: string = '';

  constructor(
    private modalController: ModalController,
    private apiService: ApiService
  ) {}

  ngOnInit() {}

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  sendResetEmail() {
    if (this.email) {
      this.modalController.dismiss(
        {
          email: this.email,
        },
        'reset'
      );
    }
  }
}
