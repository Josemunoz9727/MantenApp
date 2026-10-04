import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'nueva',
    loadComponent: () => import('./form/form.page').then((m) => m.FormPage),
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./form/form.page').then((m) => m.FormPage),
  },
  { path: '**', redirectTo: 'home' },
];
