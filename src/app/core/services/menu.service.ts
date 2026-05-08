import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { AppConfigService } from '@core/config/app-config.service';
import { MenuItem } from '@core/models/menu.model';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private menusRequest$: Observable<MenuItem[]> | null = null;

  private get apiUrl(): string {
    return `${this.appConfig.apiBaseUrl}/api/menu`;
  }

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService
  ) {}

  getMyMenus(): Observable<MenuItem[]> {
    if (!this.menusRequest$) {
      this.menusRequest$ = this.http.get<MenuItem[]>(`${this.apiUrl}/me`).pipe(
        shareReplay({ bufferSize: 1, refCount: false })
      );
    }

    return this.menusRequest$;
  }

  clearCache(): void {
    this.menusRequest$ = null;
  }
}
