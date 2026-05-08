import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppConfigService } from '@core/config/app-config.service';
import { CreateUserRequest } from '../../features/users/models/create-user-request.model';
import { UpdateUserRequest } from '../../features/users/models/update-user-request.model';
import { UserListResponse } from '../../features/users/models/user-list-response.model';
import { UserResponse } from '../../features/users/models/user-response.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly appConfig = inject(AppConfigService);

  private get apiUrl(): string {
    return `${this.appConfig.apiBaseUrl}/api/users`;
  }

  getAllUsers(): Observable<UserListResponse[]> {
    return this.http.get<UserListResponse[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`);
  }

  createUser(request: CreateUserRequest): Observable<unknown> {
    return this.http.post<unknown>(this.apiUrl, request);
  }

  updateUser(id: number, request: UpdateUserRequest): Observable<unknown> {
    return this.http.put<unknown>(`${this.apiUrl}/${id}`, request);
  }
}
