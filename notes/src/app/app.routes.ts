import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'notes',
    loadComponent: () => import('./notes/notes.page').then((m) => m.NotesPage),
  },
  {
    path: 'blueprints',
    loadComponent: () => import('./blueprints/blueprints.page').then((m) => m.BlueprintsPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
