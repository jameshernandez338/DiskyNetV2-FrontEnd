import { Injectable, signal } from '@angular/core';

export type SnackbarType = 'success' | 'warning' | 'error';

export interface SnackbarData {
  message: string;
  type: SnackbarType;
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private readonly snackbarState = signal<SnackbarData | null>(null);
  private hideTimer?: ReturnType<typeof setTimeout>;

  readonly snackbar = this.snackbarState.asReadonly();

  show(message: string, type: SnackbarType = 'success', duration = 4000): void {
    window.clearTimeout(this.hideTimer);
    this.snackbarState.set({ message, type });

    this.hideTimer = window.setTimeout(() => {
      this.hide();
    }, duration);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  hide(): void {
    window.clearTimeout(this.hideTimer);
    this.snackbarState.set(null);
  }
}
