import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppConfigService } from '@core/config/app-config.service';
import { CategoryResponse } from '../../features/tables/models/category-response.model';
import { SubCategoryResponse } from '../../features/tables/models/sub-category-response.model';
import { TypeActivityResponse } from '../../features/tables/models/type-activity-response.model';

@Injectable({ providedIn: 'root' })
export class TableService {
  private readonly http = inject(HttpClient);
  private readonly appConfig = inject(AppConfigService);

  private get apiUrl(): string {
    return `${this.appConfig.apiBaseUrl}/api/tables`;
  }

  getCategories(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(`${this.apiUrl}/categories`);
  }

  createCategory(categoryName: string): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/categories`, { categoryName });
  }

  updateCategory(categoryId: number, categoryName: string): Observable<unknown> {
    return this.http.put<unknown>(`${this.apiUrl}/categories/${categoryId}`, { categoryName });
  }

  deleteCategory(categoryId: number): Observable<unknown> {
    return this.http.delete<unknown>(`${this.apiUrl}/categories/${categoryId}`);
  }

  // ── Subcategories ─────────────────────────────────────────────────────────

  getSubCategories(): Observable<SubCategoryResponse[]> {
    return this.http.get<SubCategoryResponse[]>(`${this.apiUrl}/subcategories`);
  }

  createSubCategory(subCategoryName: string, categoryId: number): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/subcategories`, { subCategoryName, categoryId });
  }

  updateSubCategory(subCategoryId: number, subCategoryName: string, categoryId: number): Observable<unknown> {
    return this.http.put<unknown>(`${this.apiUrl}/subcategories/${subCategoryId}`, { subCategoryName, categoryId });
  }

  deleteSubCategory(subCategoryId: number): Observable<unknown> {
    return this.http.delete<unknown>(`${this.apiUrl}/subcategories/${subCategoryId}`);
  }

  // ── Type Activities ───────────────────────────────────────────────────────

  getTypeActivities(): Observable<TypeActivityResponse[]> {
    return this.http.get<TypeActivityResponse[]>(`${this.apiUrl}/type-activities`);
  }

  createTypeActivity(typeActivityName: string, typeActivityFrecDays: number): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/type-activities`, { typeActivityName, typeActivityFrecDays });
  }

  updateTypeActivity(typeActivityId: number, typeActivityName: string, typeActivityFrecDays: number): Observable<unknown> {
    return this.http.put<unknown>(`${this.apiUrl}/type-activities/${typeActivityId}`, { typeActivityName, typeActivityFrecDays });
  }

  deleteTypeActivity(typeActivityId: number): Observable<unknown> {
    return this.http.delete<unknown>(`${this.apiUrl}/type-activities/${typeActivityId}`);
  }
}
