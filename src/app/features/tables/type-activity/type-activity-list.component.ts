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
import { TypeActivityResponse } from '../models/type-activity-response.model';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TooltipDirective } from '@shared/directives/tooltip.directive';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-type-activity-list',
  imports: [FormsModule, RouterLink, LucideAngularModule, LoadingSpinnerComponent, PaginationComponent, TooltipDirective, ConfirmDialogComponent],
  templateUrl: './type-activity-list.component.html'
})
export class TypeActivityListComponent implements OnInit {
  private readonly tableService = inject(TableService);
  private readonly snackbar = inject(SnackbarService);

  icons = { House, Search, Pencil, Trash2, Check, X, Plus, ChevronRight };

  search = '';
  typeActivities: TypeActivityResponse[] = [];
  isLoading = false;
  isSaving = false;
  currentPage = 1;
  pageSize = 10;

  // Inline add
  newName = '';
  newFrecDays: number | null = null;

  // Inline edit
  editingId: number | null = null;
  editingName = '';
  editingFrecDays: number | null = null;

  // Delete confirm
  showDeleteDialog = false;
  pendingDeleteId: number | null = null;
  pendingDeleteName = '';

  ngOnInit(): void {
    this.loadTypeActivities();
  }

  private loadTypeActivities(): void {
    this.isLoading = true;
    this.tableService.getTypeActivities().subscribe({
      next: (data) => {
        this.typeActivities = data;
        this.currentPage = 1;
      },
      complete: () => { this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  get filteredTypeActivities(): TypeActivityResponse[] {
    const q = this.search.toLowerCase();
    if (!q) return this.typeActivities;
    return this.typeActivities.filter(
      (t) =>
        t.typeActivityId.toString().includes(q) ||
        t.typeActivityName.toLowerCase().includes(q) ||
        t.typeActivityFrecDays.toString().includes(q)
    );
  }

  get pagedTypeActivities(): TypeActivityResponse[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredTypeActivities.slice(start, start + this.pageSize);
  }

  onSearchChange(): void { this.currentPage = 1; }
  onPageChange(page: number): void { this.currentPage = page; }
  onPageSizeChange(size: number): void { this.pageSize = size; this.currentPage = 1; }

  // ── Add ──────────────────────────────────────────────────────────────────
  addTypeActivity(): void {
    const name = this.newName.trim();
    const frecDays = this.newFrecDays;
    if (!name || frecDays === null || frecDays < 0) return;
    this.isSaving = true;
    this.tableService.createTypeActivity(name, frecDays).subscribe({
      next: () => {
        this.newName = '';
        this.newFrecDays = null;
        this.snackbar.success('Tipo de actividad creado correctamente.');
        this.loadTypeActivities();
      },
      error: () => {
        this.isSaving = false;
        this.snackbar.error('Error al crear el tipo de actividad.');
      },
      complete: () => { this.isSaving = false; }
    });
  }

  // ── Edit ─────────────────────────────────────────────────────────────────
  startEdit(item: TypeActivityResponse): void {
    this.editingId = item.typeActivityId;
    this.editingName = item.typeActivityName;
    this.editingFrecDays = item.typeActivityFrecDays;
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editingName = '';
    this.editingFrecDays = null;
  }

  saveEdit(typeActivityId: number): void {
    const name = this.editingName.trim();
    const frecDays = this.editingFrecDays;
    if (!name || frecDays === null || frecDays < 0) return;
    this.isSaving = true;
    this.tableService.updateTypeActivity(typeActivityId, name, frecDays).subscribe({
      next: () => {
        this.cancelEdit();
        this.snackbar.success('Tipo de actividad actualizado correctamente.');
        this.loadTypeActivities();
      },
      error: () => {
        this.isSaving = false;
        this.snackbar.error('Error al actualizar el tipo de actividad.');
      },
      complete: () => { this.isSaving = false; }
    });
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  requestDelete(item: TypeActivityResponse): void {
    this.pendingDeleteId = item.typeActivityId;
    this.pendingDeleteName = item.typeActivityName;
    this.showDeleteDialog = true;
  }

  confirmDelete(): void {
    if (this.pendingDeleteId === null) return;
    this.showDeleteDialog = false;
    this.isSaving = true;
    this.tableService.deleteTypeActivity(this.pendingDeleteId).subscribe({
      next: () => {
        this.pendingDeleteId = null;
        this.snackbar.success('Tipo de actividad eliminado correctamente.');
        this.loadTypeActivities();
      },
      error: () => {
        this.isSaving = false;
        this.pendingDeleteId = null;
        this.snackbar.error('Error al eliminar el tipo de actividad.');
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
