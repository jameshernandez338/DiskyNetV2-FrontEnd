import { Routes } from '@angular/router';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/user-list/user-list.component').then(m => m.UserListComponent)
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./pages/user-form/user-form.component').then(m => m.UserFormComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('./pages/user-form/user-form.component').then(m => m.UserFormComponent)
  }
];
