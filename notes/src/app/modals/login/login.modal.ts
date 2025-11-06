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
  name: string = '';
  users: any[] = [];

  constructor(
    private modalController: ModalController,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.apiService.getUsers().subscribe({
      next: (response) => {
        console.log('All users from D1:', response);
        // this.users = response.users || [];
      },
      error: (error) => {
        console.error('Error loading users:', error);
      },
    });
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  continue() {
    if (this.email && this.name) {
      this.modalController.dismiss(
        {
          email: this.email,
          name: this.name,
        },
        'save'
      );
    }
  }
}
