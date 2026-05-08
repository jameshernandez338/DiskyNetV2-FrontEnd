import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ChevronRight, House, LucideAngularModule, Save, X } from 'lucide-angular';

import { CommonService } from '@core/services/common.service';
import { UsersService } from '@core/services/users.service';
import { ComboItemResponse } from '@core/models/combo-item-response.model';
import { SnackbarService } from '@shared/services/snackbar.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { CreateUserRequest } from '../../models/create-user-request.model';
import { UpdateUserRequest } from '../../models/update-user-request.model';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, RouterLink, LucideAngularModule, LoadingSpinnerComponent],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersService);
  private readonly commonService = inject(CommonService);
  private readonly snackbar = inject(SnackbarService);

  isEditMode = signal(false);
  isLoading = signal(false);
  isSaving = signal(false);

  roles: ComboItemResponse[] = [];

  private userId: number | null = null;

  icons = { House, ChevronRight, Save, X };

  form: FormGroup = this.fb.group({
    userName:       ['', [Validators.required, Validators.maxLength(50)]],
    email:          ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    firstName:      ['', [Validators.required, Validators.maxLength(50)]],
    middleName:     ['', [Validators.maxLength(50)]],
    lastName:       ['', [Validators.required, Validators.maxLength(50)]],
    secondLastName: ['', [Validators.maxLength(50)]],
    roleId:         [null, [Validators.required, Validators.min(1)]],
    isActive:       [true, [Validators.required]]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.userId = Number(idParam);
      this.isEditMode.set(true);
      this.isLoading.set(true);

      forkJoin({
        roles: this.commonService.getCombo('roles'),
        user:  this.usersService.getUserById(this.userId)
      }).subscribe({
        next: ({ roles, user }) => {
          this.roles = roles;
          this.form.patchValue({
            userName:       user.userName,
            email:          user.email,
            firstName:      user.firstName,
            middleName:     user.middleName ?? '',
            lastName:       user.lastName,
            secondLastName: user.secondLastName ?? '',
            roleId:         user.roleId,
            isActive:       user.isActive
          });
          this.isLoading.set(false);
        },
        error: () => {
          this.snackbar.error('No se pudo cargar los datos del usuario.');
          this.isLoading.set(false);
          this.router.navigate(['/usuarios']);
        }
      });
    } else {
      this.commonService.getCombo('roles').subscribe({
        next: (roles) => { this.roles = roles; },
        error: () => { this.snackbar.error('No se pudo cargar los roles.'); }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/usuarios']);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    this.isSaving.set(true);

    if (this.isEditMode() && this.userId !== null) {
      const request: UpdateUserRequest = {
        userName:       v.userName,
        email:          v.email,
        firstName:      v.firstName,
        middleName:     v.middleName || null,
        lastName:       v.lastName,
        secondLastName: v.secondLastName || null,
        roleId:         v.roleId,
        isActive:       v.isActive
      };
      this.usersService.updateUser(this.userId, request).subscribe({
        next: () => {
          this.snackbar.success('Usuario actualizado correctamente.');
          this.router.navigate(['/usuarios']);
        },
        error: () => {
          this.snackbar.error('No se pudo actualizar el usuario.');
          this.isSaving.set(false);
        }
      });
    } else {
      const request: CreateUserRequest = {
        userName:       v.userName,
        email:          v.email,
        firstName:      v.firstName,
        middleName:     v.middleName || null,
        lastName:       v.lastName,
        secondLastName: v.secondLastName || null,
        roleId:         v.roleId,
        isActive:       v.isActive
      };
      this.usersService.createUser(request).subscribe({
        next: () => {
          this.snackbar.success('Usuario creado correctamente.');
          this.router.navigate(['/usuarios']);
        },
        error: () => {
          this.snackbar.error('No se pudo crear el usuario.');
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
