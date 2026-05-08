import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { CircleCheck, CircleX, LucideAngularModule, TriangleAlert, X } from 'lucide-angular';

import { SnackbarService, SnackbarType } from '@shared/services/snackbar.service';

@Component({
  selector: 'app-snackbar',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css'
})
export class SnackbarComponent {
  readonly snackbarService = inject(SnackbarService);
  readonly snackbar = this.snackbarService.snackbar;

  readonly icons = {
    success: CircleCheck,
    warning: TriangleAlert,
    error: CircleX,
    close: X
  };

  readonly icon = computed(() => {
    const current = this.snackbar();

    return current ? this.icons[current.type] : this.icons.success;
  });

  readonly title = computed(() => {
    const current = this.snackbar();

    if (!current) {
      return '';
    }

    const titles: Record<SnackbarType, string> = {
      success: 'Exito',
      warning: 'Atencion',
      error: 'Error'
    };

    return titles[current.type];
  });

  hide(): void {
    this.snackbarService.hide();
  }
}
