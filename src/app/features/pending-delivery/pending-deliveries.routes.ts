import { Routes } from '@angular/router';

export const DELIVERY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/pending-delivery-list/pending-delivery-list.component').then(m => m.DespachosListComponent)
  }
];
