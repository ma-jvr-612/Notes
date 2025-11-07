import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Note, NotesService } from '../services/notes.service';
import { MobileItemComponent } from '../modals/mobile-item/mobile-item.component';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class MobileComponent implements OnInit {
  notes: Note[] = [];
  filteredNotes: Note[] = [];

  constructor(
    private notesService: NotesService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadNotes();
  }

  async openItem(note: Note) {
    const modal = await this.modalController.create({
      component: MobileItemComponent,
      componentProps: { note },
    });
    await modal.present();
    await modal.onWillDismiss();
    // Reload notes after modal closes in case changes were made
    await this.loadNotes();
  }

  async loadNotes() {
    try {
      this.notes = await this.notesService.getNotes();
      this.filteredNotes = this.notes;
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  }

  getPreview(content: string): string {
    return content.substring(0, 60) + (content.length > 60 ? '...' : '');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60)
      return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
