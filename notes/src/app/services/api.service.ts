import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Blueprint {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // This will be your Cloudflare Pages URL
  // For local development, use: http://localhost:8788
  // For production, use: https://your-site.pages.dev
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  // User endpoints
  createUser(email: string, name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, { email, name });
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  // Notes endpoints
  getNotes(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/notes/${userId}`);
  }

  createNote(userId: number, title: string, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/notes/${userId}`, { title, content });
  }

  updateNote(noteId: number, title: string, content: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/notes/${noteId}`, { title, content });
  }

  deleteNote(noteId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/notes/${noteId}`);
  }

  // Blueprints endpoints
  getBlueprints(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/blueprints/${userId}`);
  }

  createBlueprint(userId: number, title: string, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/blueprints/${userId}`, { title, content });
  }

  updateBlueprint(blueprintId: number, title: string, content: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/blueprints/${blueprintId}`, { title, content });
  }

  deleteBlueprint(blueprintId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/blueprints/${blueprintId}`);
  }
}
