import { Injectable } from '@angular/core';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private readonly STORAGE_KEY = 'ionic-notes';
  private notes: Note[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const storedNotes = localStorage.getItem(this.STORAGE_KEY);
    if (storedNotes) {
      this.notes = JSON.parse(storedNotes);
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.notes));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getNotes(): Note[] {
    return [...this.notes].sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  getNote(id: string): Note | undefined {
    return this.notes.find(note => note.id === id);
  }

  createNote(): Note {
    const newNote: Note = {
      id: this.generateId(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.notes.unshift(newNote);
    this.saveToStorage();
    return newNote;
  }

  updateNote(updatedNote: Note): void {
    const index = this.notes.findIndex(note => note.id === updatedNote.id);
    if (index !== -1) {
      updatedNote.updatedAt = new Date().toISOString();
      this.notes[index] = updatedNote;
      this.saveToStorage();
    }
  }

  deleteNote(id: string): void {
    this.notes = this.notes.filter(note => note.id !== id);
    this.saveToStorage();
  }
}
