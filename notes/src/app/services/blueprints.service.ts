import { Injectable } from '@angular/core';

export interface Blueprint {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlueprintsService {
  private readonly STORAGE_KEY = 'ionic-blueprints';
  private blueprints: Blueprint[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const storedBlueprints = localStorage.getItem(this.STORAGE_KEY);
    if (storedBlueprints) {
      this.blueprints = JSON.parse(storedBlueprints);
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.blueprints));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getBlueprints(): Blueprint[] {
    return [...this.blueprints].sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  getAllBlueprints(): Blueprint[] {
    return this.getBlueprints();
  }

  getBlueprint(id: string): Blueprint | undefined {
    return this.blueprints.find(blueprint => blueprint.id === id);
  }

  createBlueprint(): Blueprint {
    const newBlueprint: Blueprint = {
      id: this.generateId(),
      title: 'Untitled Blueprint',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.blueprints.unshift(newBlueprint);
    this.saveToStorage();
    return newBlueprint;
  }

  updateBlueprint(updatedBlueprint: Blueprint): void {
    const index = this.blueprints.findIndex(blueprint => blueprint.id === updatedBlueprint.id);
    if (index !== -1) {
      updatedBlueprint.updatedAt = new Date().toISOString();
      this.blueprints[index] = updatedBlueprint;
      this.saveToStorage();
    }
  }

  deleteBlueprint(id: string): void {
    this.blueprints = this.blueprints.filter(blueprint => blueprint.id !== id);
    this.saveToStorage();
  }
}
