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
import { CommonService } from '@core/services/common.service';
import { SnackbarService } from '@shared/services/snackbar.service';
import { SubCategoryResponse } from '../models/sub-category-response.model';
import { ComboItemResponse } from '@core/models/combo-item-response.model';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TooltipDirective } from '@shared/directives/tooltip.directive';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-sub-category-list',
  imports: [FormsModule, RouterLink, LucideAngularModule, LoadingSpinnerComponent, PaginationComponent, TooltipDirective, ConfirmDialogComponent],
  templateUrl: './sub-category-list.component.html'
})
export class SubCategoryListComponent implements OnInit {
  private readonly tableService = inject(TableService);
  private readonly commonService = inject(CommonService);
  private readonly snackbar = inject(SnackbarService);

  icons = { House, Search, Pencil, Trash2, Check, X, Plus, ChevronRight };

  search = '';
  subCategories: SubCategoryResponse[] = [];
  categoryCombo: ComboItemResponse[] = [];
  isLoading = false;
  isSaving = false;
  currentPage = 1;
  pageSize = 10;

  // Inline add
  newSubCategoryName = '';
  newCategoryId = '';

  // Inline edit
  editingId: number | null = null;
  editingName = '';
  editingCategoryId = '';

  // Delete confirm
  showDeleteDialog = false;
  pendingDeleteId: number | null = null;
  pendingDeleteName = '';

  ngOnInit(): void {
    this.loadCombo();
    this.loadSubCategories();
  }

  private loadCombo(): void {
    this.commonService.getCombo('expirecategory').subscribe({
      next: (data) => { this.categoryCombo = data; }
    });
  }

  private loadSubCategories(): void {
    this.isLoading = true;
    this.tableService.getSubCategories().subscribe({
      next: (data) => {
        this.subCategories = data;
        this.currentPage = 1;
      },
      complete: () => { this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  get filteredSubCategories(): SubCategoryResponse[] {
    const q = this.search.toLowerCase();
    if (!q) return this.subCategories;
    return this.subCategories.filter(
      (s) =>
        s.subCategoryId.toString().includes(q) ||
        s.subCategoryName.toLowerCase().includes(q) ||
        s.categoryName.toLowerCase().includes(q)
    );
  }

  get pagedSubCategories(): SubCategoryResponse[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredSubCategories.slice(start, start + this.pageSize);
  }

  onSearchChange(): void { this.currentPage = 1; }
  onPageChange(page: number): void { this.currentPage = page; }
  onPageSizeChange(size: number): void { this.pageSize = size; this.currentPage = 1; }

  // ── Add ──────────────────────────────────────────────────────────────────
  addSubCategory(): void {
    const name = this.newSubCategoryName.trim();
    const categoryId = parseInt(this.newCategoryId, 10);
    if (!name || !categoryId) return;
    this.isSaving = true;
    this.tableService.createSubCategory(name, categoryId).subscribe({
      next: () => {
        this.newSubCategoryName = '';
        this.newCategoryId = '';
        this.snackbar.success('Subcategoría creada correctamente.');
        this.loadSubCategories();
      },
      error: () => {
        this.isSaving = false;
        this.snackbar.error('Error al crear la subcategoría.');
      },
      complete: () => { this.isSaving = false; }
    });
  }

  // ── Edit ─────────────────────────────────────────────────────────────────
  startEdit(sub: SubCategoryResponse): void {
    this.editingId = sub.subCategoryId;
    this.editingName = sub.subCategoryName;
    this.editingCategoryId = sub.categoryId.toString();
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editingName = '';
    this.editingCategoryId = '';
  }

  saveEdit(subCategoryId: number): void {
    const name = this.editingName.trim();
    const categoryId = parseInt(this.editingCategoryId, 10);
    if (!name || !categoryId) return;
    this.isSaving = true;
    this.tableService.updateSubCategory(subCategoryId, name, categoryId).subscribe({
      next: () => {
        this.cancelEdit();
        this.snackbar.success('Subcategoría actualizada correctamente.');
        this.loadSubCategories();
      },
      error: () => {
        this.isSaving = false;
        this.snackbar.error('Error al actualizar la subcategoría.');
      },
      complete: () => { this.isSaving = false; }
    });
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  requestDelete(sub: SubCategoryResponse): void {
    this.pendingDeleteId = sub.subCategoryId;
    this.pendingDeleteName = sub.subCategoryName;
    this.showDeleteDialog = true;
  }

  confirmDelete(): void {
    if (this.pendingDeleteId === null) return;
    this.showDeleteDialog = false;
    this.isSaving = true;
    this.tableService.deleteSubCategory(this.pendingDeleteId).subscribe({
      next: () => {
        this.pendingDeleteId = null;
        this.snackbar.success('Subcategoría eliminada correctamente.');
        this.loadSubCategories();
      },
      error: () => {
        this.isSaving = false;
        this.pendingDeleteId = null;
        this.snackbar.error('Error al eliminar la subcategoría.');
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
