import { Injectable } from '@angular/core';
import { ApiService, Blueprint as FirebaseBlueprint } from './api.service';

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
  constructor(private apiService: ApiService) {}

  async getBlueprints(): Promise<Blueprint[]> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User not logged in');
    }

    try {
      const firebaseBlueprints = await this.apiService.getBlueprints(userId);
      // Convert Firebase blueprints to local Blueprint format
      return firebaseBlueprints.map(blueprint => ({
        id: blueprint.id,
        title: blueprint.title,
        content: blueprint.content,
        createdAt: blueprint.created_at.toISOString(),
        updatedAt: blueprint.updated_at.toISOString()
      })).sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } catch (error) {
      console.error('Error loading blueprints:', error);
      return [];
    }
  }

  async getAllBlueprints(): Promise<Blueprint[]> {
    return this.getBlueprints();
  }

  async getBlueprint(id: string): Promise<Blueprint | undefined> {
    const blueprints = await this.getBlueprints();
    return blueprints.find(blueprint => blueprint.id === id);
  }

  async createBlueprint(): Promise<Blueprint> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User not logged in');
    }

    try {
      const blueprintId = await this.apiService.createBlueprint(userId, 'Untitled Blueprint', '');
      const newBlueprint: Blueprint = {
        id: blueprintId,
        title: 'Untitled Blueprint',
        content: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return newBlueprint;
    } catch (error) {
      console.error('Error creating blueprint:', error);
      throw error;
    }
  }

  async updateBlueprint(updatedBlueprint: Blueprint): Promise<void> {
    try {
      await this.apiService.updateBlueprint(updatedBlueprint.id, updatedBlueprint.title, updatedBlueprint.content);
    } catch (error) {
      console.error('Error updating blueprint:', error);
      throw error;
    }
  }

  async deleteBlueprint(id: string): Promise<void> {
    try {
      await this.apiService.deleteBlueprint(id);
    } catch (error) {
      console.error('Error deleting blueprint:', error);
      throw error;
    }
  }
}
