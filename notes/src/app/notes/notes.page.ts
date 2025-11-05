import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NotesService, Note } from '../services/notes.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class NotesPage implements OnInit {
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  selectedNote: Note | null = null;
  searchTerm: string = '';

  constructor(private notesService: NotesService) {}

  ngOnInit() {
    this.loadNotes();
  }

  loadNotes() {
    this.notes = this.notesService.getNotes();
    this.filteredNotes = this.notes;
  }

  createNewNote() {
    const newNote = this.notesService.createNote();
    this.loadNotes();
    this.selectNote(newNote);
  }

  selectNote(note: Note) {
    this.selectedNote = { ...note };
  }

  saveNote() {
    if (this.selectedNote) {
      this.notesService.updateNote(this.selectedNote);
      this.loadNotes();
      this.selectedNote = { ...this.selectedNote };
    }
  }

  deleteNote(note: Note) {
    this.notesService.deleteNote(note.id);
    this.loadNotes();
    if (this.selectedNote?.id === note.id) {
      this.selectedNote = null;
    }
  }

  searchNotes(event: any) {
    const query = event.target.value.toLowerCase();
    if (query.trim() === '') {
      this.filteredNotes = this.notes;
    } else {
      this.filteredNotes = this.notes.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getPreview(content: string): string {
    return content.substring(0, 60) + (content.length > 60 ? '...' : '');
  }
}
