import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppConfigService } from '@core/config/app-config.service';
import { Role } from '../../features/roles/models/role.model';
import { UpdateRoleRequest } from '../../features/roles/models/update-role-request.model';
import { CreateRoleRequest } from '../../features/roles/models/create-role-request.model';
import { RolePermissionsManagementResponse } from '../../features/roles/models/role-permissions-management-response.model';
import { UpdateRolePermissionsRequest } from '../../features/roles/models/update-role-permissions-request.model';

@Injectable({ providedIn: 'root' })
export class RolesService {
  private readonly http = inject(HttpClient);
  private readonly appConfig = inject(AppConfigService);

  private get apiUrl(): string {
    return `${this.appConfig.apiBaseUrl}/api/roles`;
  }

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }

  getRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`);
  }

  updateRole(id: number, request: UpdateRoleRequest): Observable<unknown> {
    return this.http.put<unknown>(`${this.apiUrl}/${id}`, request);
  }

  createRole(request: CreateRoleRequest): Observable<unknown> {
    return this.http.post<unknown>(this.apiUrl, request);
  }

  getRolePermissions(id: number): Observable<RolePermissionsManagementResponse> {
    return this.http.get<RolePermissionsManagementResponse>(`${this.apiUrl}/${id}/permissions`);
  }

  updateRolePermissions(id: number, request: UpdateRolePermissionsRequest): Observable<unknown> {
    return this.http.put<unknown>(`${this.apiUrl}/${id}/permissions`, request);
  }
}
