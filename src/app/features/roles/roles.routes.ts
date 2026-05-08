import { Routes } from '@angular/router';

export const ROLES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/roles-list/roles-list.component').then(m => m.RolesListComponent)
  },
  /*{
    path: 'nuevo',
    loadComponent: () =>
      import('./pages/role-form/role-form.component').then(m => m.RoleFormComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('./pages/role-form/role-form.component').then(m => m.RoleFormComponent)
  },
  {
    path: ':id/permisos',
    loadComponent: () =>
      import('./pages/role-permissions/role-permissions.component').then(m => m.RolePermissionsComponent)
  }*/
];
