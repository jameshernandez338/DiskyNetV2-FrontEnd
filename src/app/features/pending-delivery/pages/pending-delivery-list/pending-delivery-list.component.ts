import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  ChevronRight,
  Eye,
  House,
  LucideAngularModule,
  Search,
  Truck
} from 'lucide-angular';

import { DeliveryService } from '@core/services/pending-delivery.service';
import { SupplierDocumentResponse } from '../../models/supplier-document-response.model';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TooltipDirective } from '@shared/directives/tooltip.directive';

@Component({
  selector: 'app-despachos-list',
  imports: [RouterLink, FormsModule, LucideAngularModule, LoadingSpinnerComponent, PaginationComponent, TooltipDirective],
  templateUrl: './pending-delivery-list.component.html'
})
export class DespachosListComponent implements OnInit {
  private readonly deliveriesService = inject(DeliveryService);

  icons = {
    House,
    Search,
    Truck,
    Eye,
    ChevronRight
  };

  search = '';
  documents: SupplierDocumentResponse[] = [];
  isLoading = false;
  currentPage = 1;
  pageSize = 10;

  ngOnInit(): void {
    this.isLoading = true;
    this.deliveriesService.getSupplierDocuments().subscribe({
      next: (docs) => {
        this.documents = docs;
        this.currentPage = 1;
      },
      complete: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  get filteredDocuments(): SupplierDocumentResponse[] {
    const q = this.search.toLowerCase();
    if (!q) return this.documents;
    return this.documents.filter(
      (d) =>
        d.number.toLowerCase().includes(q) ||
        d.status.toLowerCase().includes(q)
    );
  }

  get pagedDocuments(): SupplierDocumentResponse[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredDocuments.slice(start, start + this.pageSize);
  }

  onSearchChange(): void {
    this.currentPage = 1;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }
}
