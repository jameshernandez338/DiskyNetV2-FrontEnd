import { Routes } from '@angular/router';

export const TABLES_ROUTES: Routes = [
  {
    path: 'categorias-vencimiento',
    loadComponent: () =>
      import('./category/category-list.component').then(m => m.CategoryListComponent)
  },
  {
    path: 'subcategoria-vencimiento',
    loadComponent: () =>
      import('./sub-category/sub-category-list.component').then(m => m.SubCategoryListComponent)
  },
  {
    path: 'tipo-actividad',
    loadComponent: () =>
      import('./type-activity/type-activity-list.component').then(m => m.TypeActivityListComponent)
  }
];
