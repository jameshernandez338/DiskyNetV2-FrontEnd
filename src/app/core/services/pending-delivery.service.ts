import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppConfigService } from '@core/config/app-config.service';
import { SupplierDocumentResponse } from '../../features/pending-delivery/models/supplier-document-response.model';

@Injectable({ providedIn: 'root' })
export class DeliveryService {
  private readonly http = inject(HttpClient);
  private readonly appConfig = inject(AppConfigService);

  private get apiUrl(): string {
    return `${this.appConfig.apiBaseUrl}/api/pending-delivery`;
  }

  getSupplierDocuments(): Observable<SupplierDocumentResponse[]> {
    return this.http.get<SupplierDocumentResponse[]>(`${this.apiUrl}/supplier-documents`);
  }
}
