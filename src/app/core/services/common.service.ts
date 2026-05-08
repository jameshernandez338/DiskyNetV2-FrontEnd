import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppConfigService } from '@core/config/app-config.service';
import { ComboItemResponse } from '@core/models/combo-item-response.model';

@Injectable({ providedIn: 'root' })
export class CommonService {
  private readonly http = inject(HttpClient);
  private readonly appConfig = inject(AppConfigService);

  private get apiUrl(): string {
    return `${this.appConfig.apiBaseUrl}/api/common`;
  }

  getCombo(comboType: string): Observable<ComboItemResponse[]> {
    return this.http.get<ComboItemResponse[]>(`${this.apiUrl}/combos/${comboType}`);
  }
}
