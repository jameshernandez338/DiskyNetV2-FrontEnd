import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  Check,
  ChevronRight,
  House,
  LucideAngularModule,
  Pencil,
  Plus,
  Search,
  Trash2,
  X
} from 'lucide-angular';

import { TableService } from '@core/services/table.service';
import { SnackbarService } from '@shared/services/snackbar.service';
import { CategoryResponse } from '../models/category-response.model';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TooltipDirective } from '@shared/directives/tooltip.directive';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-category-list',
  imports: [FormsModule, RouterLink, LucideAngularModule, LoadingSpinnerComponent, PaginationComponent, TooltipDirective, ConfirmDialogComponent],
  templateUrl: './category-list.component.html'
})
export class CategoryListComponent implements OnInit {
  private readonly tableService = inject(TableService);
  private readonly snackbar = inject(SnackbarService);

  icons = { House, Search, Pencil, Trash2, Check, X, Plus, ChevronRight };

  search = '';
  categories: CategoryResponse[] = [];
  isLoading = false;
  isSaving = false;
  currentPage = 1;
  pageSize = 10;

  // Inline add
  newCategoryName = '';

  // Inline edit
  editingId: number | null = null;
  editingName = '';

  // Delete confirm
  showDeleteDialog = false;
  pendingDeleteId: number | null = null;
  pendingDeleteName = '';

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.isLoading = true;
    this.tableService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.currentPage = 1;
      },
      complete: () => { this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  get filteredCategories(): CategoryResponse[] {
    const q = this.search.toLowerCase();
    if (!q) return this.categories;
    return this.categories.filter(
      (c) => c.categoryId.toString().includes(q) || c.categoryName.toLowerCase().includes(q)
    );
  }

  get pagedCategories(): CategoryResponse[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCategories.slice(start, start + this.pageSize);
  }

  onSearchChange(): void { this.currentPage = 1; }
  onPageChange(page: number): void { this.currentPage = page; }
  onPageSizeChange(size: number): void { this.pageSize = size; this.currentPage = 1; }

  // ── Add ──────────────────────────────────────────────────────────────────
  addCategory(): void {
    const name = this.newCategoryName.trim();
    if (!name) return;
    this.isSaving = true;
    this.tableService.createCategory(name).subscribe({
      next: () => {
        this.newCategoryName = '';
        this.snackbar.success('Categoría creada correctamente.');
        this.loadCategories();
      },
      error: () => {
        this.isSaving = false;
        this.snackbar.error('Error al crear la categoría.');
      },
      complete: () => { this.isSaving = false; }
    });
  }

  // ── Edit ─────────────────────────────────────────────────────────────────
  startEdit(category: CategoryResponse): void {
    this.editingId = category.categoryId;
    this.editingName = category.categoryName;
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editingName = '';
  }

  saveEdit(categoryId: number): void {
    const name = this.editingName.trim();
    if (!name) return;
    this.isSaving = true;
    this.tableService.updateCategory(categoryId, name).subscribe({
      next: () => {
        this.cancelEdit();
        this.snackbar.success('Categoría actualizada correctamente.');
        this.loadCategories();
      },
      error: () => {
        this.isSaving = false;
        this.snackbar.error('Error al actualizar la categoría.');
      },
      complete: () => { this.isSaving = false; }
    });
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  requestDelete(category: CategoryResponse): void {
    this.pendingDeleteId = category.categoryId;
    this.pendingDeleteName = category.categoryName;
    this.showDeleteDialog = true;
  }

  confirmDelete(): void {
    if (this.pendingDeleteId === null) return;
    this.showDeleteDialog = false;
    this.isSaving = true;
    this.tableService.deleteCategory(this.pendingDeleteId).subscribe({
      next: () => {
        this.pendingDeleteId = null;
        this.snackbar.success('Categoría eliminada correctamente.');
        this.loadCategories();
      },
      error: () => {
        this.isSaving = false;
        this.pendingDeleteId = null;
        this.snackbar.error('Error al eliminar la categoría.');
      },
      complete: () => { this.isSaving = false; }
    });
  }

  cancelDelete(): void {
    this.showDeleteDialog = false;
    this.pendingDeleteId = null;
    this.pendingDeleteName = '';
  }
}

