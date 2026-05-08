import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule, TriangleAlert, X } from 'lucide-angular';

@Component({
  selector: 'app-confirm-dialog',
  imports: [LucideAngularModule],
  templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent {
  @Input() show = false;
  @Input() title = 'Confirmar acción';
  @Input() message = '¿Estás seguro de que deseas continuar?';
  @Input() confirmLabel = 'Confirmar';
  @Input() cancelLabel = 'Cancelar';
  @Input() danger = true;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  readonly icons = { TriangleAlert, X };
}
