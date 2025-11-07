import { Injectable } from '@angular/core';
import { ApiService, Note as FirebaseNote } from './api.service';

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
  constructor(private apiService: ApiService) {}

  async getNotes(): Promise<Note[]> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User not logged in');
    }

    try {
      const firebaseNotes = await this.apiService.getNotes(userId);
      // Convert Firebase notes to local Note format
      return firebaseNotes.map(note => ({
        id: note.id,
        title: note.title,
        content: note.content,
        createdAt: note.created_at.toISOString(),
        updatedAt: note.updated_at.toISOString()
      })).sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  }

  async getNote(id: string): Promise<Note | undefined> {
    const notes = await this.getNotes();
    return notes.find(note => note.id === id);
  }

  async createNote(): Promise<Note> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User not logged in');
    }

    try {
      const noteId = await this.apiService.createNote(userId, 'Untitled Note', '');
      const newNote: Note = {
        id: noteId,
        title: 'Untitled Note',
        content: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return newNote;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }

  async updateNote(updatedNote: Note): Promise<void> {
    try {
      await this.apiService.updateNote(updatedNote.id, updatedNote.title, updatedNote.content);
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }

  async deleteNote(id: string): Promise<void> {
    try {
      await this.apiService.deleteNote(id);
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }
}
