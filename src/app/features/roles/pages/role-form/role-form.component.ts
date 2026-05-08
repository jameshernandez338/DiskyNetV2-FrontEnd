import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChevronRight, House, LucideAngularModule, Save, X } from 'lucide-angular';

import { RolesService } from '@core/services/roles.service';
import { SnackbarService } from '@shared/services/snackbar.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { CreateRoleRequest } from '../../models/create-role-request.model';
import { UpdateRoleRequest } from '../../models/update-role-request.model';

@Component({
  selector: 'app-role-form',
  imports: [ReactiveFormsModule, RouterLink, LucideAngularModule, LoadingSpinnerComponent],
  templateUrl: './role-form.component.html'
})
export class RoleFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly rolesService = inject(RolesService);
  private readonly snackbar = inject(SnackbarService);

  isEditMode = signal(false);
  isLoading = signal(false);
  isSaving = signal(false);

  private roleId: number | null = null;

  icons = { House, ChevronRight, Save, X };

  form: FormGroup = this.fb.group({
    name:        ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(255)]],
    isActive:    [true, [Validators.required]]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.roleId = Number(idParam);
      this.isEditMode.set(true);
      this.isLoading.set(true);

      this.rolesService.getRoleById(this.roleId).subscribe({
        next: (role) => {
          this.form.patchValue({
            name:        role.name,
            description: role.description,
            isActive:    role.isActive
          });
          this.isLoading.set(false);
        },
        error: () => {
          this.snackbar.error('No se pudo cargar los datos del rol.');
          this.isLoading.set(false);
          this.router.navigate(['/roles']);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/roles']);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    this.isSaving.set(true);

    if (this.isEditMode() && this.roleId !== null) {
      const request: UpdateRoleRequest = {
        id:          this.roleId,
        name:        v.name,
        description: v.description,
        isActive:    v.isActive
      };
      this.rolesService.updateRole(this.roleId, request).subscribe({
        next: () => {
          this.snackbar.success('Rol actualizado correctamente.');
          this.router.navigate(['/roles']);
        },
        error: () => {
          this.snackbar.error('No se pudo actualizar el rol.');
          this.isSaving.set(false);
        }
      });
    } else {
      const request: CreateRoleRequest = {
        name:        v.name,
        description: v.description,
        isActive:    v.isActive
      };
      this.rolesService.createRole(request).subscribe({
        next: () => {
          this.snackbar.success('Rol creado correctamente.');
          this.router.navigate(['/roles']);
        },
        error: () => {
          this.snackbar.error('No se pudo crear el rol.');
          this.isSaving.set(false);
        }
      });
    }
  }

  hasError(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}
